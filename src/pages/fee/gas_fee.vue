<template>
    <div class="row">
        <div class="col-12 col-sm-12 col-md-5 col-lg-4">
            <SingleChart query-name="fati" title="Total paid fee in FLOW" name="US dollars $" column="0" />
        </div>

        <div class="col-12 col-sm-12 col-md-5 col-lg-4">
            <SingleChart query-name="fati" title="Total paid fee in USD" column="1" />
        </div>

        <div class="col-12 col-sm-12 col-md-5 col-lg-4">
            <SingleChart query-name="fati" title="Average paid fee in USD" column="2" />
        </div>

        <div class="col-12 col-sm-12 col-md-5 col-lg-3">
            <SingleChart query-name="fati" title="Total Spend Gas Price" column="3" />
        </div>

        <div class="col-12 col-sm-12 col-md-5 col-lg-4">
            <SingleChart query-name="fati" title="Minimum paid fee in USD" column="4" />
        </div>

        <div class="col-12 col-sm-12 col-md-5 col-lg-4">
            <SingleChart query-name="fati" title="Maximum paid fee in USD" column="5" />
        </div>

        <!-- <div class="col-12 col-sm-12 col-md-4 col-lg-4">
            <SingleChart query-name="fati" title="Average mint number per minter" column="6" />
        </div> -->

        <div class="col-12 col-sm-12 col-md-12 col-lg-12">
            <BarChart class="border rounded" query-name="fifi" title="Weekly GAS spend amount" label=""
                :axis="{ x: 'date', y: 'amount' }" />
        </div>

        <div class="col-12 col-sm-12 col-md-12 col-lg-12">
            <BarChart dot-format-date class="border rounded" query-name="mimi"
                title="The top 10 addresses that spend the most on gas (in flow)" label=""
                :axis="{ x: 'users', y: 'amount_usd' }" />
        </div>

        <div class="col-12 col-sm-12 col-md-12 col-lg-12">
            <DataTable query-name="rich-list" :haders="['User', 'amount', 'amount_usd']"
                :dataNames="['users', 'amount', 'amount_usd']"
                title="The top 10 addresses that spend the most on gas (in flow)" />
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    components: {
        BarChart: () => import("@/components/charts/bar.vue"),
        // DoughnutChart: () => import("@/components/charts/doughnut.vue"),
        // LineChart: () => import("@/components/charts/line.vue"),
        // MixedChart: () => import("@/components/charts/mixed.vue"),
        SingleChart: () => import("@/components/charts/single.vue"),
        DataTable: () => import("@/components/table.vue"),

    }
}
</script>