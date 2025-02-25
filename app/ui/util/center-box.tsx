import React from "react";

export default function CenterBox(props: { children: React.ReactNode })
{
    return (
        <div className={'flex justify-center items-center'} style={ { height: '100vh' } }>
            { props.children }
        </div>
    )
}