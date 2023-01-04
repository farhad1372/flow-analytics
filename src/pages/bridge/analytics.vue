<template>
    <div class="row">
       <div class="col-12 col-md-4">
        <SingleChart query-name="bridge" title="Number of tokens" column="0" />
</div>

<div class="col-12 col-md-4">
        <SingleChart query-name="bridge" title="User number" column="1" />
</div>

<div class="col-12 col-md-4">
        <SingleChart query-name="bridge" title="Number of bridges" column="2" />
</div>

    

    <div class="col-12 col-md-12">
        <BarChart class="border rounded" query-name="bridge3" title="Daily bridge net flow" label="" :axis="{x:'date', y:'net_inflow' }" /> 
</div>

        <div class="col-12 col-md-6">
        <DoughnutChart class="border rounded" query-name="bridge5" label="Total bridges flow out" :some-in-group="{ by: 'bridge', over: 'tvl' }"  />
</div>
        <div class="col-12 col-md-6">
        <DoughnutChart class="border rounded" query-name="bridge6" label="Total bridges flow out" :some-in-group="{ by: 'bridge', over: 'tvl' }"  />
</div>
        <div class="col-12 col-md-12">
        <BarChart class="border rounded" dot-format-date  query-name="bridge7" title="Bridge out volume to bridges in last month " label="" :axis="{x:'bridge', y:'volume' }" />
</div>
        <div class="col-12 col-md-12"> 
        <BarChart class="border rounded" dot-format-date  query-name="bridge8" title="Bridge in volume from bridges in last month " label="" :axis="{x:'bridge', y:'volume' }" />
</div>
        <div class="col-12 col-md-12">
        <BarChart class="border rounded" dot-format-date  query-name="bridge9" title="Bridge in volume from bridges in last month " label="" :axis="{x:'symbol', y:'tvl' }" />
</div>
        <div class="col-12 col-md-12">  
        <BarChart class="border rounded" dot-format-date  query-name="bridge10" title="Token bridge in that  have most volume" label="" :axis="{x:'symbol', y:'tvl' }" />   
    </div>
    
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    components : {
          BarChart: () => import("@/components/charts/bar.vue"),
         DoughnutChart: () => import("@/components/charts/doughnut.vue"),
        // LineChart: () => import("@/components/charts/line.vue"),
        // MixedChart: () => import("@/components/charts/mixed.vue"),
        SingleChart: () => import("@/components/charts/single.vue")
    }
}
</script>