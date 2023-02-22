import { Link } from "gatsby";
import React from "react";
import { Menu, MenuItem } from "../models/Menu";

export const MenuDisplay: React.FC<Menu> = ({ menuLinks }) => {

    const links = menuLinks.map( link => (
        <li key= { link.name } className={"nav-item"}>
            <Link to ={ link.link } >
                { link.name }
            </ Link>
        </ li>
    ))

    return (
        <div>
            <nav>
                <ul className={"nav-list"}>
                    { links }
                </ul>
            </ nav>
        </ div>
    )
} 