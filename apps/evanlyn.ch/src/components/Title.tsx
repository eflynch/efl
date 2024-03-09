import { useContext, useEffect, useRef, useState } from 'react';
import MagnoliaContext from '../context';
import { Trunk } from '../mainstate';
import ContentEditable from './ContentEditable';
import Notes from './Notes';

function placeCaretAtEnd(el:HTMLElement) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
    } 
}

type TitleProps = {
    setFocus:(child?:Trunk)=>void;
    setHead:(child?:Trunk)=>void;
    setTitle:(child:Trunk, title:string)=>void;
    setNotes:(child:Trunk, note:string)=>void;
    hasFocus:boolean;
    entryEnabled:boolean;
    takingNotes:boolean;
    showNotes:boolean;
    trunk:Trunk;
};

function Title(props:TitleProps):JSX.Element {
    const {setFocus, setHead, setTitle, setNotes, hasFocus, entryEnabled, takingNotes, showNotes, trunk} = props;
    const {dispatch} = useContext(MagnoliaContext);

    const input = useRef<HTMLDivElement>(null);
    const bottom = useRef<HTMLDivElement>(null);
    const notes = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState<boolean>(false);

    useEffect(() => {
        if (hasFocus) {
            setActive(true);
            if (entryEnabled) {
                input.current && input.current.focus();
            } else if (takingNotes) {
                notes.current && notes.current.focus();
            } else {
                bottom.current && bottom.current.focus();
            }
        }
    }, [hasFocus, entryEnabled, takingNotes, active]);


    const onBlur = () => {
        setActive(false);
    };
    const onFocus = () => {
        input.current && placeCaretAtEnd(input.current);
    };

    const topClassName = [
        'magnolia_ce',
        'magnolia_ce_top',
        !entryEnabled ? 'magnolia_transparent' : '',
        (hasFocus && !takingNotes) ? 'magnolia_focused' : ''
    ].join(" ");
    const bottomClassName = [
        'magnolia_ce',
        'magnolia_ce_bottom',
        entryEnabled ? 'magnolia_transparent' : '',
        (hasFocus && !takingNotes) ? 'magnolia_focused' : ''
    ].join(" ");

    return (
        <>
            <div  className="magnolia_ce_wrapper" onClick={(e) => {
                setFocus(trunk);
                e.preventDefault();
                if (!e.metaKey || trunk.value?.content) {
                    setHead(trunk);
                } else if (trunk.value?.link) {
                    window.location = trunk.value.link as (Location & string);
                }
            }}> 
                <ContentEditable className={bottomClassName}
                                    refInternal={bottom}
                                    onBlur={onBlur}
                                    tabIndex={-1}
                                    html={trunk.value?.title ?? ""}
                                    disabled={true}/>
                <ContentEditable refInternal={input} className={topClassName}
                                    onPaste={(e:ClipboardEvent)=>{
                                        if (trunk.value?.title) {
                                            return;
                                        }
                                        const clipboardData = e.clipboardData;
                                        const pastedData = clipboardData?.getData('Text');
                                        if (pastedData === undefined){
                                            return
                                        }
                                        try {
                                            const obj = JSON.parse(pastedData);
                                            e.stopPropagation();
                                            e.preventDefault();
                                            dispatch({type:"PASTE", child:trunk, subtree:obj});
                                        } catch {
                                            // do nothing
                                        }
                                    }}
                                    html={trunk.value?.title ?? ""}
                                    onBlur={onBlur}
                                    onFocus={onFocus}
                                    onChange={(e) => {
                                        if (e.target.value !== trunk.value?.title) {
                                            setTitle(trunk, e.target.value);
                                        }
                                    }}/>
            </div>
            {showNotes ? <Notes hasFocus={takingNotes} refInternal={notes} note={trunk.value?.note ?? ""} setNotes={(note:string)=>setNotes(trunk, note)} /> : null}
        </>
    );
}

export default Title;
