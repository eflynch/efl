
export const errorAction = (error:string) => {
    return () => ({
        error: error
    })
}