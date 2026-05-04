(function () {
    const DEFAULT_TEXT_COLOR = "rgba(19, 35, 34, 1)";
    const ACTIVE_TEXT_COLOR = "rgba(0, 124, 194, 1)";
    const MENU_STORAGE_KEY = "appMenuActiveItem";
    const MENU_ROOT_ID = "app-menu-root";
    const MENU_STYLE_ID = "app-menu-style";
    const MENU_BASE_PATH = window.location.pathname.replace(/\\/g, "/").includes("/mobile/") ? "../" : "./";

    const desktopToggleMenu = window.toggleMenu;

    const menuSections = [
        {
            title: "TEST FLOWS",
            items: [
                { id: "add-to-cart-flow", label: "Add to Cart Flow", route: `${MENU_BASE_PATH}index.html` },
                { id: "checkout-flow", label: "Checkout Flow", route: `${MENU_BASE_PATH}mobile/selected-item.html` },
                { id: "log-in-flow", label: "Log In Flow", route: `${MENU_BASE_PATH}login.html` },
                { id: "qr-code-scanner", label: "QR Code Scanner" },
                { id: "drawing", label: "Drawing", route: `${MENU_BASE_PATH}mobile/drawing.html` }
            ]
        },
        {
            title: "ACTIONS",
            items: [
                { id: "log-out", label: "Log Out", action: "logout" },
                { id: "reset-app-state", label: "Reset App State", action: "reset" }
            ]
        },
        {
            title: "OTHER",
            items: [
                { id: "api-calls", label: "API Calls" },
                { id: "report-a-bug", label: "Report A Bug" },
                { id: "about", label: "About" }
            ]
        }
    ];

    function getRootPath() {
        return MENU_BASE_PATH;
    }

    function inferActiveItemId() {
        const path = window.location.pathname.replace(/\\/g, "/").toLowerCase();

        if (path.endsWith("/mobile/drawing.html")) {
            return "drawing";
        }

        if (
            path.endsWith("/mobile/selected-item.html") ||
            path.endsWith("/mobile/checkout-order-address.html") ||
            path.endsWith("/mobile/checkout-payment-method.html")
        ) {
            return "checkout-flow";
        }

        if (path.endsWith("/index.html") || path.endsWith("/cart.html")) {
            return "add-to-cart-flow";
        }

        if (path.endsWith("/login.html")) {
            return "log-in-flow";
        }

        return "";
    }

    function ensureStyles() {
        if (document.getElementById(MENU_STYLE_ID)) {
            return;
        }

        const style = document.createElement("style");
        style.id = MENU_STYLE_ID;
        style.textContent = `
            .app-menu-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.12);
                backdrop-filter: blur(1px);
                z-index: 9998;
            }

            .app-menu-shell {
                position: fixed;
                top: 0;
                left: 0;
                width: min(340px, 100vw);
                height: min(865px, 100vh);
                z-index: 9999;
                pointer-events: none;
            }

            .app-menu-label {
                padding: 18px 0 8px 20px;
                font-family: 'Noto Sans', sans-serif;
                font-size: 16px;
                font-weight: 400;
                line-height: 1.2;
                color: ${DEFAULT_TEXT_COLOR};
                user-select: none;
            }

            .app-menu-panel {
                width: 100%;
                height: calc(100% - 34px);
                background: #ffffff;
                box-shadow: 16px 0px 40px rgba(0, 0, 0, 0.15);
                overflow: hidden;
                pointer-events: auto;
            }

            .app-menu-scroll {
                height: 100%;
                overflow-y: auto;
                padding: 10px 20px 22px 20px;
                scrollbar-width: none;
            }

            .app-menu-scroll::-webkit-scrollbar {
                width: 0;
                height: 0;
            }

            .app-menu-section + .app-menu-section {
                margin-top: 14px;
            }

            .app-menu-section-title {
                margin: 0 0 8px 0;
                font-family: 'Noto Sans', sans-serif;
                font-size: 12px;
                font-weight: 400;
                line-height: 1.4;
                letter-spacing: 0.08em;
                color: ${DEFAULT_TEXT_COLOR};
                text-transform: uppercase;
                user-select: none;
            }

            .app-menu-item {
                width: 100%;
                display: block;
                padding: 13px 0 12px 0;
                border: 0;
                border-bottom: 1px solid rgba(237, 237, 237, 1);
                background: transparent;
                text-align: left;
                font-family: 'Noto Sans', sans-serif;
                font-size: 17px;
                font-weight: 400;
                line-height: 1.35;
                color: ${DEFAULT_TEXT_COLOR};
                cursor: pointer;
                outline: none;
            }

            .app-menu-item.is-active {
                color: ${ACTIVE_TEXT_COLOR};
            }

            .app-menu-item:focus-visible {
                outline: 1px solid rgba(0, 124, 194, 0.22);
                outline-offset: 2px;
            }
        `;

        document.head.appendChild(style);
    }

    function clearAppState() {
        ["myCart", "checkoutInfo", "checkoutOrderAddress", MENU_STORAGE_KEY].forEach((key) => {
            localStorage.removeItem(key);
        });
    }

    function closeAppMenu() {
        const shell = document.getElementById(MENU_ROOT_ID);
        const backdrop = document.getElementById("app-menu-backdrop");

        if (shell) {
            shell.hidden = true;
            shell.setAttribute("aria-hidden", "true");
        }

        if (backdrop) {
            backdrop.hidden = true;
        }

        document.body.style.overflow = "";
    }

    function setActiveItem(itemId) {
        const buttons = document.querySelectorAll("[data-app-menu-item]");
        buttons.forEach((button) => {
            const isActive = button.dataset.appMenuItem === itemId;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-current", isActive ? "true" : "false");
        });

        if (itemId) {
            localStorage.setItem(MENU_STORAGE_KEY, itemId);
        } else {
            localStorage.removeItem(MENU_STORAGE_KEY);
        }
    }

    function handleMenuItemClick(item) {
        setActiveItem(item.id);

        if (item.route) {
            closeAppMenu();
            window.location.href = item.route;
            return;
        }

        if (item.action === "logout") {
            closeAppMenu();
            window.location.href = `${getRootPath()}login.html`;
            return;
        }

        if (item.action === "reset") {
            clearAppState();
            closeAppMenu();
            window.location.reload();
        }
    }

    function createMenuItem(item, activeItemId) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "app-menu-item";
        button.textContent = item.label;
        button.dataset.appMenuItem = item.id;
        button.setAttribute("aria-current", item.id === activeItemId ? "true" : "false");

        if (item.id === activeItemId) {
            button.classList.add("is-active");
        }

        button.addEventListener("click", () => handleMenuItemClick(item));

        return button;
    }

    function buildMenu() {
        if (document.getElementById(MENU_ROOT_ID)) {
            return;
        }

        ensureStyles();

        const backdrop = document.createElement("div");
        backdrop.id = "app-menu-backdrop";
        backdrop.className = "app-menu-backdrop";
        backdrop.hidden = true;
        backdrop.addEventListener("click", closeAppMenu);

        const shell = document.createElement("aside");
        shell.id = MENU_ROOT_ID;
        shell.className = "app-menu-shell";
        shell.hidden = true;
        shell.setAttribute("aria-hidden", "true");
        shell.setAttribute("aria-label", "App menu");

        const label = document.createElement("div");
        label.className = "app-menu-label";
        label.textContent = "Menu";

        const panel = document.createElement("div");
        panel.className = "app-menu-panel";

        const scroll = document.createElement("div");
        scroll.className = "app-menu-scroll";

        const activeItemId = inferActiveItemId() || localStorage.getItem(MENU_STORAGE_KEY) || "";

        menuSections.forEach((section) => {
            const sectionWrap = document.createElement("section");
            sectionWrap.className = "app-menu-section";

            const sectionTitle = document.createElement("div");
            sectionTitle.className = "app-menu-section-title";
            sectionTitle.textContent = section.title;
            sectionWrap.appendChild(sectionTitle);

            section.items.forEach((item) => {
                sectionWrap.appendChild(createMenuItem(item, activeItemId));
            });

            scroll.appendChild(sectionWrap);
        });

        panel.appendChild(scroll);
        shell.appendChild(label);
        shell.appendChild(panel);

        document.body.appendChild(backdrop);
        document.body.appendChild(shell);

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeAppMenu();
            }
        });
    }

    function openAppMenu() {
        buildMenu();

        const shell = document.getElementById(MENU_ROOT_ID);
        const backdrop = document.getElementById("app-menu-backdrop");

        if (!shell || !backdrop) {
            return;
        }

        shell.hidden = false;
        shell.setAttribute("aria-hidden", "false");
        backdrop.hidden = false;
        document.body.style.overflow = "hidden";
    }

    function toggleAppMenu() {
        buildMenu();

        const shell = document.getElementById(MENU_ROOT_ID);
        if (!shell) {
            return;
        }

        if (shell.hidden) {
            openAppMenu();
        } else {
            closeAppMenu();
        }
    }

    window.toggleMenu = function toggleMenu(mode) {
        if (mode === "app") {
            toggleAppMenu();
            return;
        }

        if (typeof desktopToggleMenu === "function") {
            return desktopToggleMenu.apply(this, arguments);
        }
    };

    window.openAppMenu = openAppMenu;
    window.closeAppMenu = closeAppMenu;
    window.toggleAppMenu = toggleAppMenu;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", buildMenu);
    } else {
        buildMenu();
    }
})();
