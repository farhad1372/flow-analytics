import Vue from "vue";
import VueRouter from "vue-router";
import HomeLayout from "../components/base-layout.vue";
import Home from "../pages/home.vue";
Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        component: HomeLayout,
        children: [
            {
                path: "",
                name: "Home",
                component: Home,
                meta: {
                    title: ['Introduction'],
                    next: {
                        text: "General > Concepts",
                        link: "general.concepts"
                    },
                    prev: null,
                }
            },
            {
                path: "general/concepts",
                name: "general.concepts",
                component: () => import("../pages/general/concepts.vue"),
                meta: {
                    title: ['General', 'Concepts'],
                    prev: {
                        text: "Introduction",
                        link: "Home"
                    },
                    next: {
                        text: "General > Analytics",
                        link: "general.analytics"
                    },
                }
            },

            {
                path: "general/analytics",
                name: "general.analytics",
                component: () => import("../pages/general/analytics.vue"),
                meta: {
                    title: ['General', 'Analytics'],
                    prev: {
                        text: "General > Concepts",
                        link: "general.concepts"
                    },
                    next: {
                        text: "Fee > Concepts",
                        link: "fee.concepts"
                    },
                }
            },


            // -------------------------- fee
            {
                path: "fee/concepts",
                name: "fee.concepts",
                component: () => import("../pages/fee/concepts.vue"),
                meta: {
                    title: ['Fee', 'Concepts'],
                    prev: {
                        text: "General > Analytics",
                        link: "general.analytics"
                    },
                    next: {
                        text: "Fee > Gas Fee",
                        link: "fee.gasfee"
                    },
                }
            },

            {
                path: "fee/gas-fee",
                name: "fee.gasfee",
                component: () => import("../pages/fee/gas_fee.vue"),
                meta: {
                    title: ['Fee', 'Gas Fee'],
                    prev: {
                        text: "Fee > Concepts",
                        link: "fee.concepts"
                    },
                    next: {
                        text: "Fee > Miner & Block",
                        link: "fee.minersblock"
                    },
                }
            },

            {
                path: "fee/miners-block",
                name: "fee.minersblock",
                component: () => import("../pages/fee/miners_block.vue"),
                meta: {
                    title: ['Fee', 'Miner & Block'],
                    prev: {
                        text: "Fee > Gas Fee",
                        link: "fee.gasfee"
                    },
                    next: {
                        text: "Stake & Unstake > Concepts",
                        link: "stake-unstake.concepts"
                    },
                }
            },

            // -------------------------- stake-unstake
            {
                path: "stake-unstake/concepts",
                name: "stake-unstake.concepts",
                component: () => import("../pages/stake-unstake/concepts.vue"),
                meta: {
                    title: ['Stake & Unstake', 'Concepts'],
                    prev: {
                        text: "Fee > Miner & Block",
                        link: "fee.minersblock"
                    },
                    next: {
                        text: "Stake & Unstake > Analytics",
                        link: "stake-unstake.analytics"
                    },
                }
            },

            {
                path: "stake-unstake/analytics",
                name: "stake-unstake.analytics",
                component: () => import("../pages/stake-unstake/analytics.vue"),
                meta: {
                    title: ['Stake & Unstake', 'Analytics'],
                    prev: {
                        text: "Fee > Miner & Block",
                        link: "stake-unstake.concepts"
                    },
                    next: {
                        text: "NFT > Concepts",
                        link: "nft.concepts"
                    },
                }
            },

            // -------------------------- nft
            {
                path: "nft/concepts",
                name: "nft.concepts",
                component: () => import("../pages/nft/concepts.vue"),
                meta: {
                    title: ['NFT', 'Concepts'],
                    prev: {
                        text: "take & Unstake > Analytics",
                        link: "stake-unstake.analytics"
                    },
                    next: {
                        text: "NFT > Seals",
                        link: "nft.seals"
                    },
                }
            },

            // {
            //     path: "nft/mint",
            //     name: "nft.mint",
            //     component: () => import("../pages/nft/mint.vue"),
            //     meta: {
            //         title: ['NFT', 'Mint']
            //     }
            // },

            {
                path: "nft/seals",
                name: "nft.seals",
                component: () => import("../pages/nft/seals.vue"),
                meta: {
                    title: ['NFT', 'Seals'],
                    prev: {
                        text: "NFT > Concepts",
                        link: "nft.concepts"
                    },
                    next: {
                        text: "Bridge > Concepts",
                        link: "bridge.concepts"
                    },
                }
            },

            // --- analitics



            // -------------------------- bridge
            {
                path: "bridge/concepts",
                name: "bridge.concepts",
                component: () => import("../pages/bridge/concepts.vue"),
                meta: {
                    title: ['Bridge', 'Concepts'],
                    prev: {
                        text: "NFT > Seals",
                        link: "nft.seals"
                    },
                    next: {
                        text: "Bridge > Analytics",
                        link: "bridge.analytics"
                    },
                }
            },

            {
                path: "bridge/analytics",
                name: "bridge.analytics",
                component: () => import("../pages/bridge/analytics.vue"),
                meta: {
                    title: ['Bridge', 'Analytics'],
                    prev: {
                        text: "Bridge > Concepts",
                        link: "bridge.concepts"
                    },
                    next: {
                        text: "Refrences",
                        link: "refrences"
                    },
                }
            },

            {
                path: "refrences",
                name: "refrences",
                component: () => import("../pages/refrences/index.vue"),
                meta: {
                    title: ['Refrences'],
                    prev: {
                        text: "Bridge > Analytics",
                        link: "bridge.analytics"
                    },
                    next: {
                        text: "Resources",
                        link: "resources"
                    },
                }
            },

            {
                path: "resources",
                name: "resources",
                component: () => import("../pages/resources/index.vue"),
                meta: {
                    title: ['Resources']
                }
            },





            // {
            //     path: "general",
            //     name: "General",
            //     component: () => import("../pages/sections/general.vue")
            // },
            // {
            //     path: "section-2",
            //     name: "Section-2",
            //     component: () => import("../pages/sections/section2.vue")
            // },
            // {
            //     path: "section-3",
            //     name: "Section-3",
            //     component: () => import("../pages/sections/section3.vue")
            // },
            // {
            //     path: "section-4",
            //     name: "Section-4",
            //     component: () => import("../pages/sections/section4.vue")
            // },
            // {
            //     path: "section-5",
            //     name: "Section-5",
            //     component: () => import("../pages/sections/section5.vue")
            // },
            // {
            //     path: "section-6",
            //     name: "Section-6",
            //     component: () => import("../pages/sections/section6.vue")
            // }
        ]
    },
    {
        path: "*",
        redirect: { name: "404" }
    },
    {
        path: "/not-found/404",
        component: () => import("../pages/errors/404.vue"),
        name: "404"
    }

];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    // base: "",
    routes,
    scrollBehavior() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ x: 0, y: 0, behavior: "smooth" });
            }, 100);
        });
    },
});








export default router;
