import { useCallback, useEffect, useState } from "react"
import { PartialTrunk, Trunk } from "./mainstate"
import { gapi } from "gapi-script"
import { MakeEmptyTree } from "@efl/immutable-tree";
import PromiseQueue from './promise-queue'

const CLIENT_ID = "285840911278-3bhodgt454cv64d95daca4bkf3pcn6os.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/documents";

interface GoogleDocsGetResponse {
    result: {
        body: {
            content: Array<{
                endIndex:number;
                paragraph?: {
                    elements: Array<{
                        textRun?: {
                            content: string;
                        };
                    }>;
                };
            }>;
        };
    };
}

export const useGoogleDocsDataSource = (onLoad:(trunk:Trunk|PartialTrunk)=>void, documentId:string) => {
    const [isSignedIn, setIsSignedIn] = useState<boolean|undefined>(undefined);
    const [isSyncing, setIsSyncing] = useState<boolean>(false);

    useEffect(() => {
        const initClient = () => {
            gapi.load('client:auth2', () => {
                return gapi.auth2.init({client_id: CLIENT_ID, scope: SCOPES})
                    .then(() => {
                        return gapi.client.load('docs', 'v1')
                    })
                    .then(() => {
                        // Listen for sign-in state changes.
                        gapi.auth2.getAuthInstance().isSignedIn.listen(setIsSignedIn);

                        // Handle the initial sign-in state.
                        setIsSignedIn(gapi.auth2.getAuthInstance().isSignedIn.get());
                    });
            });
        };

        initClient();
    }, []);

    const signIn = useCallback(() => {
        gapi.auth2.getAuthInstance().signIn().catch((error:unknown)=>{
            console.log("Error signing in:", error);
        })
    }, []);

    const signOut = useCallback(() => {
        gapi.auth2.getAuthInstance().signOut();
    }, []);

    const sync = useCallback((trunk:Trunk) => {
        if (!isSignedIn) {
            console.log("User is not signed in.");
            return;
        }
        setIsSyncing(true);

        PromiseQueue.enqueue(
            gapi.client.docs.documents.get({documentId: documentId}).then((response:GoogleDocsGetResponse) => {
                const d = response.result;
                const documentLength = d.body.content[d.body.content.length - 1].endIndex - 1;
                return documentLength
            }).then((documentLength:number) => {
                const requestBody = {
                    requests: [
                        {
                            // Clear the document
                            deleteContentRange: {
                                range: {
                                    startIndex: 1, // Document content starts at index 1
                                    endIndex: documentLength // A large number to clear the entire document 
                                },
                            },
                        },
                        {
                            // Insert the JSON string version of trunk
                            insertText: {
                                location: {
                                    index: 1,
                                },
                                text: JSON.stringify(trunk), // Pretty print the JSON
                            },
                        },
                    ],
                };
            
                return gapi.client.docs.documents.batchUpdate({
                    documentId: documentId,
                    resource: requestBody,
                })
            })
            .then((response:unknown) => {
                setIsSyncing(false);
                // do nothing
            }).catch((error:unknown) => {
                setIsSyncing(false);
                console.error("Error updating document:", error);
            }));
        
    }, [documentId, isSignedIn]);

    const load = useCallback(() => {
        if (!isSignedIn) {
            console.log("User is not signed in.");
            return;
        }
        
        gapi.client.docs.documents.get({
            documentId: documentId,
        }).then((response:GoogleDocsGetResponse) => {
            // Assuming the entire document content is the JSON string
            const content = response.result.body.content;
            let jsonString = "";
    
            // Loop through the content and concatenate text runs
            content.forEach((element) => {
                if (element.paragraph && element.paragraph.elements) {
                    element.paragraph.elements.forEach((elem) => {
                        if (elem.textRun && elem.textRun.content) {
                            jsonString += elem.textRun.content;
                        }
                    });
                }
            });
    
            // Remove any non-JSON characters (like newlines at the end)
            jsonString = jsonString.trim();

            // Parse the JSON string
            try {
                const jsonData = JSON.parse(jsonString);
                console.log("Document content parsed as JSON:", jsonData);
    
                // Optionally, call onLoad with the parsed JSON data
                onLoad(jsonData);
            } catch (error) {
                const tree = MakeEmptyTree(() => ({ title: '', link: undefined, content: undefined, note:undefined })).trunk
                console.error("Error parsing document content as JSON:", error);
                onLoad(tree)
            }
        }).catch((error:unknown) => {
            console.error("Error fetching document:", error);
        });
    }, [documentId, isSignedIn, onLoad]);

    return [sync, load, isSignedIn, signIn, signOut, isSyncing] as [(trunk:Trunk) => void, () => void, boolean|undefined, () => void, () => void, boolean]
}
