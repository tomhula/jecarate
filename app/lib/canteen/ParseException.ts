/*
##############################################################################################################################
CODE FROM: https://github.com/tomhula/JecnaAPI/blob/main/src/main/kotlin/me/tomasan7/jecnaapi/parser/ParseException.kt
Translated to Typescript using ChatGPT: https://chatgpt.com/share/67bb0165-3770-800e-9e10-043b69e2e95b
##############################################################################################################################
*/


export class ParseException extends Error
{
    constructor(message?: string, cause?: Error)
    {
        super(message);
        this.name = "ParseException";
        if (cause)
        {
            this.cause = cause;
        }
    }

    cause?: Error;
}
