
const state = {
  queries: {
// sigles charst season 0 
    'users': {
      result: null,
      sql: `select count(distinct PROPOSER) as active_user 
      from 
      flow.core.fact_transactions`
    },

    // season 4-1
    'NFTmint': {
      result: null,
      sql: `Select 
      sum(NFT_COUNT) as number , 
      count(distinct PROJECT_NAME) as project_number, 
      count(distinct NFT_TO_ADDRESS) as minter_number, 
      sum(MINT_PRICE_USD) as total_mint_price, 
      avg(MINT_PRICE_USD) as avg_mint_price,
      number/minter_number avergae_per_minter,
      number/project_number average_per_project
    from 
    ethereum.core.ez_nft_mints`
    },
    'NFTseals': {
      result: null,
      sql: `select 
      count(distinct NFT_ID) as total_nft,
      count(distinct MARKETPLACE) as total_market,  
      count(distinct NFT_COLLECTION) as total_collections,  
      count(distinct BUYER) as total_users,
      sum(PRICE)/total_nft as average_nft_price , 
       total_nft/total_market as average_nft_market, 
       total_nft/total_collections as  average_nft_collections
      from 
      flow.core.ez_nft_sales
      
      `
    },
   // bridge
    'bridge': {
      result: null,
      sql: `select 
      count( Distinct BRIDGE) as bridge_number,
      count(distinct FLOW_WALLET_ADDRESS) as total_users, 
      count( Distinct TOKEN_CONTRACT) as token_number
      from 
      flow.core.ez_bridge_transactions
      `
    }
    ,
    'fati': {
      result: null,
      sql: ` with tb1 as (select 
        timestamp::date as day,
        avg (price_usd) as price_token
        from flow.core.fact_prices
        where symbol = 'FLOW'
        group by 1)
        
        select 
        sum(gas_limit/1e9) as amount,
        sum(price_token*gas_limit/1e9) as amount_usd,
        avg(price_token*gas_limit/1e9) as avg_usd,
        median(price_token*gas_limit/1e9) as median_usd,
        min(price_token*gas_limit/1e9) as min_usd,
        max(price_token*gas_limit/1e9) as max_usd,
        amount_usd/count(distinct date_trunc(day, block_timestamp)) as average_usd_day,
        amount_usd/count(distinct BLOCK_HEIGHT) as average_usd_block
        --(sum(fee*price_token) / (sum(amount*price_token)))*1000000 as average_per_one_million
          
        from flow.core.fact_transactions s left join tb1 b on s.BLOCK_TIMESTAMP::date=b.day
        
      `
    },


//

  }

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
