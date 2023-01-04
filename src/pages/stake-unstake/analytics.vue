<template>
    <div class="row">
  

 <div class="col-12 col-sm-12 col-md-12 col-lg-12">
        <BarChart class="border rounded" query-name="stak" title="Weekly staking" label="" :axis="{x:'date', y:'satke' }" />
         </div>


    <div class="col-12 col-sm-12 col-md-12 col-lg-12">
        <BarChart class="border rounded" query-name="stak" title="Weekly unstaking" label="" :axis="{x:'date', y:'unstke' }" />
        </div>


         <div class="col-12 col-sm-12 col-md-12 col-lg-12">
        <BarChart class="border rounded"  query-name="stak" title="Weekly staking getting reward" label="" :axis="{x:'date', y:'get_reward' }" />
         </div>

    
         
        <div class="col-12 col-sm-12 col-md-12 col-lg-12">
        <LineChart class="border rounded" query-name="stake" title="Weekly cumulative staking " :point-radius="0" :axis="{x:'date', y:'c_stake' }" />
        </div>

        <div class="col-12 col-sm-12 col-md-12 col-lg-12">
        <LineChart class="border rounded" query-name="stake" title="Weekly cumulative unstaking " :point-radius="0" :axis="{x:'date', y:'c_unstake' }" />
        </div>

        <div class="col-12 col-sm-12 col-md-12 col-lg-12">
        <LineChart class="border rounded" query-name="stake" title="Weekly cumulative getting reward" :point-radius="0" :axis="{x:'date', y:'c_get_reward' }" />
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
        // DoughnutChart: () => import("@/components/charts/doughnut.vue"),
        LineChart: () => import("@/components/charts/line.vue"),
        // MixedChart: () => import("@/components/charts/mixed.vue"),
        // SingleChart: () => import("@/components/charts/single.vue")
    }
}
</script>