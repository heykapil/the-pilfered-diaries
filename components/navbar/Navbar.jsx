import { IconMenu2, IconX } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo, useRef } from "react";
import { APP_TITLE } from "../../constants/app.constants";
import {
  QUICK_COLLAPSE_NAV_ROUTES,
  ROUTES,
} from "../../constants/route.constants";
import styles from "./Navbar.module.scss";
import logoWhite from "../../resources/images/tpd-logo-w.svg";
import Image from "next/image";

function Navbar() {
  const { pathname } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [sbInstance, setSbInstance] = useState(null);
  const sidebarRef = useRef();

  const threshold = useMemo(() => {
    return QUICK_COLLAPSE_NAV_ROUTES.includes(pathname) ? 50 : 250;
  }, [pathname]);

  useEffect(() => {
    const scrollHandler = (e) => {
      setScrolled(e.target.scrollingElement.scrollTop >= threshold);
    };
    document.addEventListener("scroll", scrollHandler, { passive: true });
    return () => {
      document.removeEventListener("scroll", scrollHandler, { passive: true });
    };
  }, [threshold]);

  const openMenu = () => {
    if (!sbInstance) {
      const { Offcanvas } = require("bootstrap");
      const sideBar = new Offcanvas(sidebarRef.current, {});
      setSbInstance(sideBar);
      sideBar.show();
    } else sbInstance.show();
  };

  const closeMenu = () => {
    sbInstance.hide();
  };

  return (
    <>
      <nav
        className={`${styles["tpd-navbar"]} ${
          scrolled ? styles["tpd-navbar--scrolled"] : ""
        } container-fluid`}>
        <div
          className={`${styles["tpd-navbar__content"]} ${
            scrolled ? styles["tpd-navbar__content--scrolled"] : "container"
          } shadow`}>
          <Link
            href="/"
            className="h3 text-decoration-none fw-normal mb-0 text-light d-flex align-items-center">
            <Image
              width={36}
              height={36}
              alt="site-logo"
              src={logoWhite}
              style={{
                transition: "opacity 0.2s ease-in-out",
                marginRight: "1rem",
              }}
            />
            {APP_TITLE}
          </Link>
          <button
            className={styles["tpd-navbar_menu-toggler"]}
            onClick={openMenu}>
            <IconMenu2 />
          </button>
        </div>
      </nav>

      <div
        className="offcanvas offcanvas-end tpd-sidebar"
        tabIndex="-1"
        ref={sidebarRef}
        aria-labelledby="tpdSidebarLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="tpdSidebarLabel">
            {APP_TITLE}
          </h5>
          <button
            type="button"
            className="icon-btn border-0"
            data-bs-dismiss="offcanvas"
            aria-label="Close">
            <IconX size={18} />
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="d-flex flex-column w-100 gap-3" onClick={closeMenu}>
            {ROUTES.map((route) => (
              <Link
                key={route.path}
                className={`btn w-100 d-flex justify-content-start ${
                  route.matchers.includes(pathname)
                    ? "btn-primary"
                    : "text-primary"
                }`}
                href={route.path}>
                {route.label.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
