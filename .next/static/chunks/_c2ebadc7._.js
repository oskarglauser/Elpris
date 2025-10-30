(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/shared/BottomNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BottomNav",
    ()=>BottomNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function BottomNav(param) {
    let { prototypePrefix = '' } = param;
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const navItems = [
        {
            label: 'Hem',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                className: "w-5 h-5"
            }, void 0, false, {
                fileName: "[project]/components/shared/BottomNav.tsx",
                lineNumber: 20,
                columnNumber: 13
            }, this),
            href: prototypePrefix || '/'
        },
        {
            label: 'Insikter',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                className: "w-5 h-5"
            }, void 0, false, {
                fileName: "[project]/components/shared/BottomNav.tsx",
                lineNumber: 25,
                columnNumber: 13
            }, this),
            href: "".concat(prototypePrefix, "/insights")
        },
        {
            label: 'Enheter',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                className: "w-5 h-5"
            }, void 0, false, {
                fileName: "[project]/components/shared/BottomNav.tsx",
                lineNumber: 30,
                columnNumber: 13
            }, this),
            href: "".concat(prototypePrefix, "/devices")
        },
        {
            label: 'Profil',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                className: "w-5 h-5"
            }, void 0, false, {
                fileName: "[project]/components/shared/BottomNav.tsx",
                lineNumber: 35,
                columnNumber: 13
            }, this),
            href: "".concat(prototypePrefix, "/profile")
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "fixed bottom-0 left-0 right-0 bg-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-around px-4 py-2 max-w-md mx-auto",
            children: navItems.map((item)=>{
                const isActive = pathname === item.href;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: item.href,
                    className: "flex flex-col items-center gap-1 px-4 py-2 transition-colors ".concat(isActive ? 'text-foreground' : 'text-muted-foreground'),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: isActive ? 'text-foreground' : '',
                            children: item.icon
                        }, void 0, false, {
                            fileName: "[project]/components/shared/BottomNav.tsx",
                            lineNumber: 53,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs",
                            children: item.label
                        }, void 0, false, {
                            fileName: "[project]/components/shared/BottomNav.tsx",
                            lineNumber: 54,
                            columnNumber: 15
                        }, this)
                    ]
                }, item.label, true, {
                    fileName: "[project]/components/shared/BottomNav.tsx",
                    lineNumber: 46,
                    columnNumber: 13
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/components/shared/BottomNav.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/shared/BottomNav.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(BottomNav, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = BottomNav;
var _c;
__turbopack_context__.k.register(_c, "BottomNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn() {
    for(var _len = arguments.length, inputs = new Array(_len), _key = 0; _key < _len; _key++){
        inputs[_key] = arguments[_key];
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Card(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-card text-card-foreground flex flex-col gap-6 rounded py-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Card;
function CardHeader(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c1 = CardHeader;
function CardTitle(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c2 = CardTitle;
function CardDescription(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c3 = CardDescription;
function CardAction(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c4 = CardAction;
function CardContent(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_c5 = CardContent;
function CardFooter(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center px-6 [.border-t]:pt-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_c6 = CardFooter;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardDescription");
__turbopack_context__.k.register(_c4, "CardAction");
__turbopack_context__.k.register(_c5, "CardContent");
__turbopack_context__.k.register(_c6, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/electricity-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Type definitions for 15-minute electricity price data
__turbopack_context__.s([
    "calculatePriceStats",
    ()=>calculatePriceStats,
    "fetchElectricityPrices",
    ()=>fetchElectricityPrices,
    "fetchTodayAndTomorrowPrices",
    ()=>fetchTodayAndTomorrowPrices,
    "fetchTodaysPrices",
    ()=>fetchTodaysPrices,
    "fetchTomorrowsPrices",
    ()=>fetchTomorrowsPrices,
    "formatPrice",
    ()=>formatPrice,
    "formatTimeRange",
    ()=>formatTimeRange,
    "getCurrentDate",
    ()=>getCurrentDate,
    "getCurrentPriceInterval",
    ()=>getCurrentPriceInterval,
    "getPriceLevel",
    ()=>getPriceLevel,
    "getTomorrowDate",
    ()=>getTomorrowDate
]);
async function fetchElectricityPrices(year, month, day) {
    let region = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 'SE3';
    const url = "https://www.elprisetjustnu.se/api/v1/prices/".concat(year, "/").concat(month, "-").concat(day, "_").concat(region, ".json");
    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Data ej tillgänglig för ".concat(year, "-").concat(month, "-").concat(day, ". Morgondagens priser publiceras tidigast kl 13:00."));
            }
            throw new Error("HTTP ".concat(response.status, ": ").concat(response.statusText));
        }
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Tom eller ogiltig data från API');
        }
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Nätverksfel: Kunde inte hämta elpriser');
    }
}
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return {
        year,
        month,
        day
    };
}
async function fetchTodaysPrices() {
    let region = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'SE3';
    const { year, month, day } = getCurrentDate();
    return fetchElectricityPrices(year, month, day, region);
}
function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear().toString();
    const month = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
    const day = tomorrow.getDate().toString().padStart(2, '0');
    return {
        year,
        month,
        day
    };
}
async function fetchTomorrowsPrices() {
    let region = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'SE3';
    const { year, month, day } = getTomorrowDate();
    return fetchElectricityPrices(year, month, day, region);
}
async function fetchTodayAndTomorrowPrices() {
    let region = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'SE3';
    try {
        const [today, tomorrow] = await Promise.all([
            fetchTodaysPrices(region),
            fetchTomorrowsPrices(region).catch((err)=>{
                console.info('Morgondagens priser är inte tillgängliga än:', err.message);
                return [];
            })
        ]);
        if (today.length === 0) {
            throw new Error('Inga elpriser tillgängliga för idag');
        }
        return {
            today,
            tomorrow
        };
    } catch (error) {
        console.error('Error fetching prices:', error);
        throw error;
    }
}
function getCurrentPriceInterval(prices) {
    const now = new Date();
    for (const interval of prices){
        const start = new Date(interval.time_start);
        const end = new Date(interval.time_end);
        if (now >= start && now < end) {
            return interval;
        }
    }
    return null;
}
function calculatePriceStats(prices) {
    if (prices.length === 0) {
        return {
            min: 0,
            max: 0,
            average: 0
        };
    }
    const priceValues = prices.map((p)=>p.SEK_per_kWh);
    const min = Math.min(...priceValues);
    const max = Math.max(...priceValues);
    const average = priceValues.reduce((sum, price)=>sum + price, 0) / priceValues.length;
    return {
        min,
        max,
        average
    };
}
function getPriceLevel(price, average) {
    const threshold = average * 0.2; // 20% threshold
    if (price < average - threshold) return 'low';
    if (price > average + threshold) return 'high';
    return 'medium';
}
function formatTimeRange(start, end) {
    const startTime = new Date(start).toLocaleTimeString('sv-SE', {
        hour: '2-digit',
        minute: '2-digit'
    });
    const endTime = new Date(end).toLocaleTimeString('sv-SE', {
        hour: '2-digit',
        minute: '2-digit'
    });
    return "Idag, ".concat(startTime, "-").concat(endTime);
}
function formatPrice(price) {
    return "".concat(price.toFixed(1), " öre/kWh");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/prototypes/prototype-a/SpotPriceChart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SpotPriceChart",
    ()=>SpotPriceChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$electricity$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/electricity-api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/chart.js/dist/chart.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chartjs$2d$plugin$2d$annotation$2f$dist$2f$chartjs$2d$plugin$2d$annotation$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/chartjs-plugin-annotation/dist/chartjs-plugin-annotation.esm.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
// Register Chart.js components
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Chart"].register(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CategoryScale"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LinearScale"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PointElement"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LineElement"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LineController"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Title"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Tooltip"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Legend"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Filler"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chartjs$2d$plugin$2d$annotation$2f$dist$2f$chartjs$2d$plugin$2d$annotation$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
function SpotPriceChart(param) {
    let { prototypeId } = param;
    _s();
    const [prices, setPrices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [displayedInterval, setDisplayedInterval] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedIndex, setSelectedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const chartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SpotPriceChart.useEffect": ()=>{
            async function loadPrices() {
                try {
                    const { today, tomorrow } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$electricity$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchTodayAndTomorrowPrices"])();
                    const allPrices = [
                        ...today,
                        ...tomorrow
                    ];
                    setPrices(allPrices);
                    const current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$electricity$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentPriceInterval"])(allPrices);
                    setDisplayedInterval(current);
                    setError(null);
                } catch (error) {
                    console.error('Failed to load prices:', error);
                    setError(error instanceof Error ? error.message : 'Failed to load electricity prices');
                } finally{
                    setLoading(false);
                }
            }
            loadPrices();
        }
    }["SpotPriceChart.useEffect"], []);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: "p-4 bg-card border-border",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-64 flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-muted-foreground",
                    children: "Loading prices..."
                }, void 0, false, {
                    fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
                    lineNumber: 74,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
            lineNumber: 72,
            columnNumber: 7
        }, this);
    }
    if (error || prices.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: "p-4 bg-card border-border",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-64 flex flex-col items-center justify-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-muted-foreground text-center",
                        children: error || 'No price data available'
                    }, void 0, false, {
                        fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>window.location.reload(),
                        className: "px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90",
                        children: "Retry"
                    }, void 0, false, {
                        fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
                lineNumber: 83,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
            lineNumber: 82,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: "p-4 bg-white rounded",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-start pb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: [
                            displayedInterval && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-end gap-1 leading-none mb-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[32px] font-normal text-black leading-[36px] tracking-[-0.96px]",
                                        children: (displayedInterval.SEK_per_kWh * 100).toFixed(1)
                                    }, void 0, false, {
                                        fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
                                        lineNumber: 104,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[16px] font-normal text-black leading-[24px] tracking-[-0.24px] pb-[6px]",
                                        children: "öre"
                                    }, void 0, false, {
                                        fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
                                        lineNumber: 107,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
                                lineNumber: 103,
                                columnNumber: 13
                            }, this),
                            displayedInterval && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[14px] font-normal text-black leading-[20px] tracking-[-0.14px]",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$electricity$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTimeRange"])(displayedInterval.time_start, displayedInterval.time_end)
                            }, void 0, false, {
                                fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
                                lineNumber: 113,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/prototype-".concat(prototypeId, "/detail"),
                        className: "flex items-center gap-0 text-[16px] font-normal text-black leading-[24px] tracking-[-0.24px] hover:opacity-70 transition-opacity",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Dagens elpris"
                            }, void 0, false, {
                                fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
                                lineNumber: 119,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
                                lineNumber: 120,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative h-[139px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RollingLineChart, {
                    prices: prices,
                    chartRef: chartRef,
                    onIntervalChange: (interval, index)=>{
                        setDisplayedInterval(interval);
                        setSelectedIndex(index);
                    },
                    onReset: ()=>{
                        setDisplayedInterval((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$electricity$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentPriceInterval"])(prices));
                        setSelectedIndex(null);
                    }
                }, void 0, false, {
                    fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
                    lineNumber: 125,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
_s(SpotPriceChart, "6y1BnY5BF8U89lUW8/ipse8b0FA=");
_c = SpotPriceChart;
function RollingLineChart(param) {
    let { prices, chartRef, onIntervalChange, onReset } = param;
    _s1();
    const [activeIndexInWindow, setActiveIndexInWindow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const internalChartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Get current time and create 18-hour window
    const now = new Date();
    const currentInterval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$electricity$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentPriceInterval"])(prices);
    const currentIndex = prices.findIndex((p)=>new Date(p.time_start) <= now && new Date(p.time_end) > now);
    if (currentIndex === -1 || !currentInterval) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-muted-foreground",
            children: "No price data available"
        }, void 0, false, {
            fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
            lineNumber: 165,
            columnNumber: 12
        }, this);
    }
    // Start window 1-2 hours before current time
    // Go back 4-8 intervals (1-2 hours) depending on current time
    const backIntervals = 4; // 1 hour back
    const windowStartIndex = Math.max(0, currentIndex - backIntervals);
    // Calculate 18-hour window (72 intervals: 18 hours × 4 quarters each)
    // But limit to available data
    const maxWindowSize = 72;
    const windowEndIndex = Math.min(windowStartIndex + maxWindowSize, prices.length);
    const windowIntervals = prices.slice(windowStartIndex, windowEndIndex);
    // Calculate price range
    const priceValues = windowIntervals.map((p)=>p.SEK_per_kWh * 100); // Convert to öre
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);
    const avgPrice = priceValues.reduce((a, b)=>a + b, 0) / priceValues.length;
    // Current index within the window
    const currentIndexInWindow = currentIndex - windowStartIndex;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RollingLineChart.useEffect": ()=>{
            if (!canvasRef.current || windowIntervals.length === 0) return;
            if (internalChartRef.current) {
                internalChartRef.current.destroy();
            }
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;
            // Create labels - show hours and minutes
            const labels = windowIntervals.map({
                "RollingLineChart.useEffect.labels": (interval)=>{
                    const start = new Date(interval.time_start);
                    const h = String(start.getHours()).padStart(2, '0');
                    const m = String(start.getMinutes()).padStart(2, '0');
                    return "".concat(h, ":").concat(m);
                }
            }["RollingLineChart.useEffect.labels"]);
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, 'rgba(215, 51, 51, 0.1)');
            gradient.addColorStop(0.45, 'rgba(255, 193, 7, 0.1)');
            gradient.addColorStop(0.8, 'rgba(0, 154, 51, 0.1)');
            gradient.addColorStop(1, 'rgba(0, 154, 51, 0.05)');
            const annotations = {};
            // Add new day boundary indicator (solid line at midnight)
            for(let i = 1; i < windowIntervals.length; i++){
                const prevDate = new Date(windowIntervals[i - 1].time_start);
                const currDate = new Date(windowIntervals[i].time_start);
                // Check if we crossed midnight
                if (prevDate.getDate() !== currDate.getDate()) {
                    annotations["dayBoundary".concat(i)] = {
                        type: 'line',
                        xMin: i,
                        xMax: i,
                        borderColor: '#CDC8C2',
                        borderWidth: 1.5,
                        borderDash: [
                            0
                        ]
                    };
                }
            }
            // Add current time line (grey dashed, no label)
            if (currentIndexInWindow >= 0 && currentIndexInWindow < windowIntervals.length) {
                annotations.currentTime = {
                    type: 'line',
                    xMin: currentIndexInWindow,
                    xMax: currentIndexInWindow,
                    borderColor: '#CDC8C2',
                    borderWidth: 1.5,
                    borderDash: [
                        5,
                        5
                    ],
                    label: {
                        display: false
                    }
                };
            }
            const chart = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Chart"](canvasRef.current, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Pris (öre/kWh)',
                            data: priceValues,
                            borderColor: '#191919',
                            backgroundColor: gradient,
                            borderWidth: 1.5,
                            fill: 'origin',
                            stepped: true,
                            pointRadius: 0,
                            pointHoverRadius: 0,
                            segment: {
                                borderColor: {
                                    "RollingLineChart.useEffect": (ctx)=>{
                                        const price = ctx.p1.parsed.y;
                                        if (price == null) return '#FFC107';
                                        if (price < avgPrice * 0.85) return '#009A33';
                                        if (price >= avgPrice * 1.15) return '#D73333';
                                        return '#FFC107';
                                    }
                                }["RollingLineChart.useEffect"]
                            }
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'nearest',
                        intersect: false,
                        axis: 'x'
                    },
                    onHover: {
                        "RollingLineChart.useEffect": (event, activeElements)=>{
                            if (activeElements.length > 0) {
                                const windowIndex = activeElements[0].index;
                                const globalIndex = windowStartIndex + windowIndex;
                                setActiveIndexInWindow(windowIndex);
                                onIntervalChange(prices[globalIndex], globalIndex);
                            }
                        }
                    }["RollingLineChart.useEffect"],
                    onClick: {
                        "RollingLineChart.useEffect": (event, activeElements)=>{
                            if (activeElements.length > 0) {
                                const windowIndex = activeElements[0].index;
                                const globalIndex = windowStartIndex + windowIndex;
                                setActiveIndexInWindow(windowIndex);
                                onIntervalChange(prices[globalIndex], globalIndex);
                            }
                        }
                    }["RollingLineChart.useEffect"],
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: false
                        },
                        annotation: {
                            annotations
                        }
                    },
                    scales: {
                        y: {
                            display: true,
                            position: 'left',
                            beginAtZero: true,
                            min: 0,
                            max: 90,
                            ticks: {
                                stepSize: 30,
                                font: {
                                    size: 12
                                },
                                color: '#000000',
                                padding: 5,
                                callback: {
                                    "RollingLineChart.useEffect": function(value) {
                                        return value;
                                    }
                                }["RollingLineChart.useEffect"]
                            },
                            grid: {
                                display: true,
                                color: '#CDC8C2',
                                lineWidth: 1
                            },
                            border: {
                                display: false
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    size: 12
                                },
                                color: '#000000',
                                maxRotation: 0,
                                minRotation: 0,
                                autoSkip: false,
                                padding: 0,
                                callback: {
                                    "RollingLineChart.useEffect": function(value, index) {
                                        // Show label every 8 intervals (2 hours)
                                        if (index % 8 === 0) {
                                            const interval = windowIntervals[index];
                                            if (interval) {
                                                const hour = new Date(interval.time_start).getHours();
                                                return String(hour).padStart(2, '0');
                                            }
                                        }
                                        return '';
                                    }
                                }["RollingLineChart.useEffect"]
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
            internalChartRef.current = chart;
            return ({
                "RollingLineChart.useEffect": ()=>{
                    if (internalChartRef.current) {
                        internalChartRef.current.destroy();
                    }
                }
            })["RollingLineChart.useEffect"];
        }
    }["RollingLineChart.useEffect"], [
        windowStartIndex,
        windowEndIndex,
        currentIndexInWindow
    ]);
    // Update active line annotation when hovering without recreating chart
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RollingLineChart.useEffect": ()=>{
            var _chart_options_plugins_annotation, _chart_options_plugins;
            if (!internalChartRef.current) return;
            const chart = internalChartRef.current;
            const annotations = (_chart_options_plugins = chart.options.plugins) === null || _chart_options_plugins === void 0 ? void 0 : (_chart_options_plugins_annotation = _chart_options_plugins.annotation) === null || _chart_options_plugins_annotation === void 0 ? void 0 : _chart_options_plugins_annotation.annotations;
            if (!annotations) return;
            // Remove existing active line
            if (annotations.activeTimeLine) {
                delete annotations.activeTimeLine;
            }
            // Add active/selected line (black solid) if user is interacting
            if (activeIndexInWindow !== null && activeIndexInWindow >= 0 && activeIndexInWindow < windowIntervals.length) {
                annotations.activeTimeLine = {
                    type: 'line',
                    xMin: activeIndexInWindow,
                    xMax: activeIndexInWindow,
                    yMin: 0,
                    yMax: 'max',
                    borderColor: '#000000',
                    borderWidth: 2,
                    borderDash: [
                        0
                    ],
                    drawTime: 'afterDatasetsDraw',
                    label: {
                        display: false
                    }
                };
            }
            chart.update('none'); // Update without animation
        }
    }["RollingLineChart.useEffect"], [
        activeIndexInWindow,
        windowIntervals.length
    ]);
    // Add double-click to reset and mouse leave to auto-return to current time
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RollingLineChart.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (canvas) {
                const handleDoubleClick = {
                    "RollingLineChart.useEffect.handleDoubleClick": ()=>{
                        setActiveIndexInWindow(null);
                        onReset();
                    }
                }["RollingLineChart.useEffect.handleDoubleClick"];
                const handleMouseLeave = {
                    "RollingLineChart.useEffect.handleMouseLeave": ()=>{
                        setActiveIndexInWindow(null);
                        onReset();
                    }
                }["RollingLineChart.useEffect.handleMouseLeave"];
                canvas.addEventListener('dblclick', handleDoubleClick);
                canvas.addEventListener('mouseleave', handleMouseLeave);
                return ({
                    "RollingLineChart.useEffect": ()=>{
                        canvas.removeEventListener('dblclick', handleDoubleClick);
                        canvas.removeEventListener('mouseleave', handleMouseLeave);
                    }
                })["RollingLineChart.useEffect"];
            }
        }
    }["RollingLineChart.useEffect"], [
        onReset
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef
    }, void 0, false, {
        fileName: "[project]/components/prototypes/prototype-a/SpotPriceChart.tsx",
        lineNumber: 421,
        columnNumber: 10
    }, this);
}
_s1(RollingLineChart, "PU6kjeBoEonA0oheA8Z5JQWP9ao=");
_c1 = RollingLineChart;
var _c, _c1;
__turbopack_context__.k.register(_c, "SpotPriceChart");
__turbopack_context__.k.register(_c1, "RollingLineChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_c2ebadc7._.js.map