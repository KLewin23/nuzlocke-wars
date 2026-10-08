import React, { ReactNode } from 'react'

interface Props {
    children: ReactNode
}

const layout = ({children}: Props) =>  (
        <div className="col gradient-radial-blue h-screen items-center w-full">{children}</div>
    )


export default layout