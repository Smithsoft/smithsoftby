import * as React from "react"
import { Link } from "gatsby"
import { Menu } from "../models/Menu"
import { MenuDisplay } from "./MenuDisplay"

type LayoutProps = {
  location: Location
  title: string
  menu?: Menu
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ location, title, menu, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  const header = (
    <h1 className="main-heading">
      <Link to="/">{title}</Link>
    </h1>
  )

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">
        {header}
        {menu && <MenuDisplay menuLinks={menu.menuLinks}></MenuDisplay>}
      </header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout
