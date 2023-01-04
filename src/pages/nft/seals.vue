<template>
    <div class="row">

        <div class="col-12 col-md-3">
            <SingleChart query-name="NFTseals" name="" title="Total NFT numbers" column="0" />
        </div>

        <div class="col-12 col-md-3">
            <SingleChart query-name="NFTseals" name="" title="Number of marketplaces" column="1" />
        </div>

        <div class="col-12 col-md-3">
            <SingleChart query-name="NFTseals" name="" title="Total unique collections" column="2" />
        </div>

        <div class="col-12 col-md-3">
            <SingleChart query-name="NFTseals" name="" title="Totla unique users" column="3" />
        </div>

        <div class="col-12 col-md-4">
            <SingleChart query-name="NFTseals" name="" title="Average NFT price" column="4" />
        </div>

        <div class="col-12 col-md-4">
            <SingleChart query-name="NFTseals" name="" title="Average NFT number per mraket" column="5" />
        </div>

        <div class="col-12 col-md-4">
            <SingleChart query-name="NFTseals" name="" title="Average NFT number per collection" column="6" />
        </div>

        <div class="col-12 col-md-12">
            <BarChart class="border rounded" query-name="dailyseals" title="Weekly seals number " label=""
                :axis="{ x: 'date', y: 'number' }" />
        </div>

        <div class="col-12">
            <BarChart class="border rounded" query-name="dailyseals" title="Weekly seals volume" label=""
                :axis="{ x: 'date', y: 'volume' }" />

            <BarChart class="border rounded" query-name="dailyseals" title="Weekly average seals volume" label=""
                :axis="{ x: 'date', y: 'average_price' }" />

            <BarChart class="border rounded" dot-format-date query-name="sasi" title="Weekly average seals volume"
                label="" :axis="{ x: 'MARKETPLACE', y: 'volume' }" />
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
        SingleChart: () => import("@/components/charts/single.vue")
    }
}
</script>