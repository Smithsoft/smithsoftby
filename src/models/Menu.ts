import React from "react"

export type MenuItem = {
    link: string,
    name: string
}

export type Menu = {
    menuLinks: Array<MenuItem>
}
