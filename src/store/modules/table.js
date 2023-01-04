
const state = {
    queries: {
        'rich-list': {
            result: null,
            sql: ` with tb1 as (select 
              timestamp::date as day,
              avg (price_usd) as price_token
              from flow.core.fact_prices
              where symbol = 'FLOW'
              group by 1)
              
              select
              payer as users,
              sum(gas_limit/1e9) as amount,
              sum(price_token*gas_limit/1e9) as amount_usd,
              avg(price_token*gas_limit/1e9) as avg_usd,
              row_number() over (order by amount_usd desc) as rank1
                
              from flow.core.fact_transactions s left join tb1 b on s.BLOCK_TIMESTAMP::date=b.day
              
              group by 1
              order by 2 desc limit 10`
        },
    
    },

};

const getters = {
    getQueries(state) {
        return state.queries;
    },
};

const mutations = {
    setQueryResult(state, data) { // data => query, result
        state.queries[data.query].result = data.result;
    },
};



export default {
    namespaced: true,
    state,
    getters,
    mutations,
};
