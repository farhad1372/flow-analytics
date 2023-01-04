
const state = {
  queries: {
    //General
    'numberr': {
      result: null,
      sql: `select 
           sum(gas_limit) as transaction_fee, 
           count(*) as number ,
           avg(gas_limit) as average_transaction_fee,
           count(distinct PROPOSER) as daily_active_user, 
           date_trunc('week',BLOCK_TIMESTAMP) as date,
           number/daily_active_user as transaction_per_user,
           sum(number) over (order by date) as cumulative_transactions,
           sum(transaction_fee) over (order by date) as cumulative_fees  
          
        
        from 
        flow.core.fact_transactions
        group by date
        order by date asc
           `
    },

    //blocks_miners

    'blocks_miners': {
      result: null,
      sql: `select 
        avg(TX_COUNT) as average_per_block , 
        avg(TOTAL_DIFFICULTY) as TOTAL_DIFFICULTY_per_block, 
        avg(GAS_USED) as GAS_USED_per_block, 
        avg(GAS_LIMIT) as GAS_LIMIT_per_block, 
        avg(SIZE) as SIZE_per_block, 
      count(distinct MINER) as miner_number, 
        sum(GAS_USED)/miner_number as per_miner,
      date_trunc('week',BLOCK_TIMESTAMP ) as DATE from 
      ethereum.core.fact_blocks
      group by date
      order by date asc
        `
    },
    'miners': {
      result: null,
      sql: `with t1 as
     (select 
       sum(TX_FEE) as tx_fee, 
       date_trunc('month',BLOCK_TIMESTAMP) as date
       from ethereum.core.fact_transactions
       group by date) , 
     
     t2 as
     (select 
       sum((GAS_USED/1e9)*(BLOCK_HEADER_JSON['base_fee_per_gas']/1e9)) as eth_burn,
       date_trunc('month',BLOCK_TIMESTAMP) as datee, 
       case 
     
       when 
       BLOCK_TIMESTAMP<'	2021-08-01' then 'before'
       else 'after' end as v
     from 
     ethereum.core.fact_blocks
     
     group by datee ,v
     
     )
     , f as
     (select 
       case 
       when DATE < '2021-08-01' then TX_FEE
       else TX_FEE-ETH_BURN end as miners_tip , date ,v,ETH_BURN
       
       from 
     
     t1 a inner join t2 b 
     on a.date=b.datee)
     
     
     select *, 
     sum(miners_tip) over (order by date) as Total_miners_tip
     
     from 
     
     f
     order by date asc
     `
    },


    //NFT mints 
    'projects': {
      result: null,
      sql: `with yy as
  (select 
  count(*) as number, 
  PROJECT_NAME 
  from 
  ethereum.core.ez_nft_mints
  
  group by PROJECT_NAME
    order by number desc
  limit 20)
  
  select 
  case when PROJECT_NAME is null then 'no name' else PROJECT_NAME end as PROJECT_NAME ,
  number 
  from 
  yy
  `
    }
    ,
    'dailymint': {
      result: null,
      sql: `select 
  count(*) as number, 
  date_trunc('week',BLOCK_TIMESTAMP) as DATE
  , 
  sum(number) over (order by date) as cumulative_number 
  from 
  ethereum.core.ez_nft_mints
  
  group by date 
  order by date asc
  `
    },
    //NFT seals 

    'dailyseals': {
      result: null,
      sql: `select 
      count(*) as number , 
        sum(price) as volume, 
        avg(price) as average_price,
        date_trunc('week', BLOCK_TIMESTAMP) as date
       from 
      flow.core.ez_nft_sales
        group by date
        order by date asc
  `
    },
    'sasi': {
      result: null,
      sql: `select 
      sum(price) as  volume, 
      MARKETPLACE 
      from 
      flow.core.ez_nft_sales
        group by 2
      order by 1 DESC
      limit 10
  `
    },

    'platform': {
      result: null,
      sql: `select 
  count(*) as number, 
  sum(PRICE_USD) as volume, 
  PLATFORM_NAME
  from 
  ethereum.core.ez_nft_sales
  group by PLATFORM_NAME
  `
    }, 'fifi': {
      result: null,
      sql: ` with tb1 as (select 
        timestamp::date as day,
        avg (price_usd) as price_token
        from flow.core.fact_prices
        where symbol = 'FLOW'
        group by 1)
        
        SELECT
        date_trunc('week',block_timestamp) as date,
        price_token,
        sum(event_data:"amount") as amount,
        sum(price_token*event_data:"amount") as amount_usd,
        avg(price_token*event_data:"amount") as avg_usd,
        median(price_token*event_data:"amount") as median_usd,
        min(price_token*event_data:"amount") as min_usd,
        max(price_token*event_data:"amount") as max_usd,
        amount_usd/count(distinct BLOCK_HEIGHT) as average_usd_block,
        avg(avg_usd) OVER (ORDER BY date ROWS BETWEEN 7 PRECEDING AND CURRENT ROW) as MA_7_Days,
        sum(amount_usd) over (order by date) as cum_volume
        
          
        from flow.core.fact_events  s left join tb1 b on s.BLOCK_TIMESTAMP::date=b.day
        
        and event_type='FeesDeducted'
        group by 1,2
        order by 1`
    },
    'mimi': {
      result: null,
      sql: `  with tb1 as (select 
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
    order by 2 desc limit 10
  `
    },
    // bridge
    'bridge3': {
      result: null,
      sql: `with prices as (
        with flow_prices as (
          select block_timestamp::date as date, avg(TOKEN_OUT_AMOUNT)/avg(TOKEN_IN_AMOUNT) as flow_price
          from flow.core.ez_swaps
          where TOKEN_OUT_CONTRACT = 'A.cfdd90d4a00f7b5b.TeleportedTetherToken'
          and TOKEN_IN_CONTRACT = 'A.1654653399040a61.FlowToken'
          group by 1
        ), wbtc_prices as (
          select hour::date as date, avg(price) as wbtc_price
          from ethereum.core.fact_hourly_token_prices 
          where symbol = 'WBTC'
          group by 1
        ), weth_prices as (
          select hour::date as date, avg(price) as weth_price
          from ethereum.core.fact_hourly_token_prices 
          where symbol = 'WETH'
          group by 1
        ), matic_prices as (
          select hour::date as date, avg(price) as matic_price
          from ethereum.core.fact_hourly_token_prices 
          where symbol = 'MATIC'
          group by 1
        ), ftm_prices as (
          select hour::date as date, avg(price) as ftm_price
          from ethereum.core.fact_hourly_token_prices 
          where symbol = 'FTM'
          group by 1
        ), bnb_prices as (
          select BLOCK_TIMESTAMP::date as date, avg(ASSET_USD) as bnb_price
          from flipside_prod_db.thorchain.prices
          where POOL_NAME = 'BNB.BNB'
          group by 1
        ), sportium_prices as (
          select timestamp::date as date, avg(price_usd) as Sportium_price
          from flow.core.fact_prices
          where token = 'Sportium'
          group by 1
        ), rally_prices as (
          select timestamp::date as date, avg(price_usd) as Rally_price
          from flow.core.fact_prices
          where token = 'Rally'
          group by 1
        ), Starly_prices as (
          select timestamp::date as date, avg(price_usd) as Starly_price
          from flow.core.fact_prices
          where token = 'Starly'
          group by 1
        ), REVV_prices as (
          select timestamp::date as date, avg(price_usd) as REVV_price
          from flow.core.fact_prices
          where token = 'REVV'
          group by 1
        ), Blocto_prices as (
          select timestamp::date as date, avg(price_usd) as Blocto_price
          from flow.core.fact_prices
          where token = 'Blocto Token'
          group by 1
        )
          
        select *
        from flow_prices 
          left join wbtc_prices USING(date)
          left join weth_prices USING(date)
          left join matic_prices USING(date)
          left join ftm_prices USING(date)
          left join bnb_prices USING(date)
          left join sportium_prices USING(date)
          left join rally_prices USING(date)
          left join Starly_prices USING(date)
          left join REVV_prices USING(date)
          left join Blocto_prices USING(date)
        order by 1 desc
      ), inbound as (
        select 
          block_timestamp::date as date,
          tx_id,
          bridge,
          blockchain,
          case when token_contract = 'A.cfdd90d4a00f7b5b.TeleportedTetherToken' then 'USDT'
          when token_contract = 'A.1654653399040a61.FlowToken' then 'FLOW'
          when token_contract = 'A.0f9df91c9121c460.BloctoToken' then 'BLOCTO'
          when token_contract = 'A.231cc0dbbcffc4b7.ceWBTC' then 'WBTC'
          when token_contract = 'A.231cc0dbbcffc4b7.ceWETH' then 'WETH'
          when token_contract = 'A.231cc0dbbcffc4b7.ceMATIC' then 'MATIC'
          when token_contract = 'A.231cc0dbbcffc4b7.RLY' then 'RALLY'
          when token_contract = 'A.231cc0dbbcffc4b7.ceBNB' then 'BNB'
          when token_contract = 'A.231cc0dbbcffc4b7.ceFTM' then 'FTM'
          when token_contract = 'A.231cc0dbbcffc4b7.ceBUSD' then 'BUSD' 
          when token_contract = 'A.231cc0dbbcffc4b7.ceAVAX' then 'AVAX'
          when token_contract = 'A.d01e482eb680ec9f.REVV' then 'REVV'
          when token_contract = 'A.142fa6570b62fd97.StarlyToken' then 'STARLY'
          when token_contract = 'A.475755d2c9dccc3a.TeleportedSportiumToken' then 'SPORTIUM'
          end as token,
          case when token_contract = 'A.cfdd90d4a00f7b5b.TeleportedTetherToken' then amount -- USDT
          when token_contract = 'A.1654653399040a61.FlowToken' then amount * flow_price -- FLOW
          when token_contract = 'A.0f9df91c9121c460.BloctoToken' then amount * BLOCTO_PRICE -- BLOCTO
          when token_contract = 'A.231cc0dbbcffc4b7.ceWBTC' then amount * WBTC_PRICE -- WBTC
          when token_contract = 'A.231cc0dbbcffc4b7.ceWETH' then amount * WETH_PRICE -- WETH
          when token_contract = 'A.231cc0dbbcffc4b7.ceMATIC' then amount * MATIC_PRICE -- MATIC
          when token_contract = 'A.231cc0dbbcffc4b7.RLY' then amount * RALLY_PRICE -- RALLY
          when token_contract = 'A.231cc0dbbcffc4b7.ceBNB' then amount * BNB_PRICE --BNB
          when token_contract = 'A.231cc0dbbcffc4b7.ceFTM' then amount * FTM_PRICE --FTM
          when token_contract = 'A.231cc0dbbcffc4b7.ceBUSD' then amount --BUSD
          when token_contract = 'A.231cc0dbbcffc4b7.ceAVAX' then amount * 17 --AVAX
          when token_contract = 'A.d01e482eb680ec9f.REVV' then amount * REVV_PRICE -- REVV
          when token_contract = 'A.142fa6570b62fd97.StarlyToken' then amount * STARLY_PRICE -- STARLY
          when token_contract = 'A.475755d2c9dccc3a.TeleportedSportiumToken' then amount * SPORTIUM_PRICE -- SPORTIUM
          end as amount_usd
        from flow.core.ez_bridge_transactions t left join prices p on block_timestamp::date = p.date
        where direction = 'inbound'
        and date <= '2022-06-30'
      ), outbound as (
        select 
          block_timestamp::date as date,
          tx_id,
          bridge,
          blockchain,
          case when token_contract = 'A.cfdd90d4a00f7b5b.TeleportedTetherToken' then 'USDT'
          when token_contract = 'A.1654653399040a61.FlowToken' then 'FLOW'
          when token_contract = 'A.0f9df91c9121c460.BloctoToken' then 'BLOCTO'
          when token_contract = 'A.231cc0dbbcffc4b7.ceWBTC' then 'WBTC'
          when token_contract = 'A.231cc0dbbcffc4b7.ceWETH' then 'WETH'
          when token_contract = 'A.231cc0dbbcffc4b7.ceMATIC' then 'MATIC'
          when token_contract = 'A.231cc0dbbcffc4b7.RLY' then 'RALLY'
          when token_contract = 'A.231cc0dbbcffc4b7.ceBNB' then 'BNB'
          when token_contract = 'A.231cc0dbbcffc4b7.ceFTM' then 'FTM'
          when token_contract = 'A.231cc0dbbcffc4b7.ceBUSD' then 'BUSD' 
          when token_contract = 'A.231cc0dbbcffc4b7.ceAVAX' then 'AVAX'
          when token_contract = 'A.d01e482eb680ec9f.REVV' then 'REVV'
          when token_contract = 'A.142fa6570b62fd97.StarlyToken' then 'STARLY'
          when token_contract = 'A.475755d2c9dccc3a.TeleportedSportiumToken' then 'SPORTIUM'
          end as token,
          case when token_contract = 'A.cfdd90d4a00f7b5b.TeleportedTetherToken' then amount -- USDT
          when token_contract = 'A.1654653399040a61.FlowToken' then amount * flow_price -- FLOW
          when token_contract = 'A.0f9df91c9121c460.BloctoToken' then amount * BLOCTO_PRICE -- BLOCTO
          when token_contract = 'A.231cc0dbbcffc4b7.ceWBTC' then amount * WBTC_PRICE -- WBTC
          when token_contract = 'A.231cc0dbbcffc4b7.ceWETH' then amount * WETH_PRICE -- WETH
          when token_contract = 'A.231cc0dbbcffc4b7.ceMATIC' then amount * MATIC_PRICE -- MATIC
          when token_contract = 'A.231cc0dbbcffc4b7.RLY' then amount * RALLY_PRICE -- RALLY
          when token_contract = 'A.231cc0dbbcffc4b7.ceBNB' then amount * BNB_PRICE --BNB
          when token_contract = 'A.231cc0dbbcffc4b7.ceFTM' then amount * FTM_PRICE --FTM
          when token_contract = 'A.231cc0dbbcffc4b7.ceBUSD' then amount --BUSD
          when token_contract = 'A.231cc0dbbcffc4b7.ceAVAX' then amount * 17 --AVAX
          when token_contract = 'A.d01e482eb680ec9f.REVV' then amount * REVV_PRICE -- REVV
          when token_contract = 'A.142fa6570b62fd97.StarlyToken' then amount * STARLY_PRICE -- STARLY
          when token_contract = 'A.475755d2c9dccc3a.TeleportedSportiumToken' then amount * SPORTIUM_PRICE -- SPORTIUM
          end as amount_usd
        from flow.core.ez_bridge_transactions t left join prices p on block_timestamp::date = p.date
        where direction = 'outbound'
        and date <= '2022-06-30'
      )
      
      , inbound_final as (
        select 
          date,
          count(distinct tx_id) inbound_total_txs,
          sum(amount_usd) inbound_total_amount_usd
        from inbound
        group by 1
      )
      
      , outbound_final as (
        select 
          date,
          count(distinct tx_id) outbound_total_txs,
          sum(amount_usd) outbound_total_amount_usd
        from outbound
        group by 1
      )
      
      select date, 
        flow_price,
        inbound_total_txs, outbound_total_txs,
        INBOUND_TOTAL_AMOUNT_USD, 
        OUTBOUND_TOTAL_AMOUNT_USD as OUTBOUND_TOTAL_AMOUNT_USD, 
        INBOUND_TOTAL_AMOUNT_USD-OUTBOUND_TOTAL_AMOUNT_USD as net_inflow, 
        sum(OUTBOUND_TOTAL_AMOUNT_USD) over (order by date) as c_out,
        sum(INBOUND_TOTAL_AMOUNT_USD) over (order by date) as c_in
      from inbound_final left join outbound_final using(date)
      left join prices using(date)
      order by 1 desc
 `
    },

    'bridge4': {
      result: null,
      sql: `with prices as (
   SELECT date(HOUR) as day, symbol, token_address, decimals, min(price) as avg_price
   from ethereum.core.fact_hourly_token_prices
   where SYMBOL not in ('DG', 'BORING')
   GROUP by day, token_address, symbol, decimals
 ),
 all_data as (
     select *
     from (
     select date_trunc('month', a.BLOCK_TIMESTAMP) as day,
     case when TO_ADDRESS in ('0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0', '0x8eb8a3b98659cce290402893d0123abb75e3ab28') then 'Avalanche Bridge'
     when TO_ADDRESS = '0xf92cd566ea4864356c5491c177a430c222d7e678' then 'Solana Wormhole'
     when TO_ADDRESS = '0x23ddd3e3692d1861ed57ede224608875809e127f' then 'Near Rainbow Bridge'
     when TO_ADDRESS = '0x2dccdb493827e15a5dc8f8b72147e6c4a5620857' then 'Harmony Bridges'
     when TO_ADDRESS = '0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe' then 'Fantom Anyswap Bridge'
     when TO_ADDRESS in ('0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf', '0x401f6c983ea34274ec46f84d70b31c151321188b' )then 'Polygon Bridges'
     when TO_ADDRESS in ('0x467194771dae2967aef3ecbedd3bf9a310c76c65', '0x99c9fc46f92e8a1c0dec1b1747d010903e884be1', '0x5fd79d46eba7f351fe49bff9e87cdea6c821ef9f' )then 'Optimism Bridges'
     when TO_ADDRESS in ('0xcee284f754e854890e311e3280b767f80797180d', '0xa3a7b6f88361f48403514059f1f16c8e78d60eec', '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f') then 'Arbitrum Bridges'
   
     when TO_ADDRESS in ('0x88ad09518695c6c3712ac10a214be5109a655671', '0x4aa42145aa6ebf72e164c9bbc74fbd3788045016') then 'Gnosis: xDAI Bridges'
     when TO_ADDRESS in ('0x6a39909e805a3eadd2b61fff61147796ca6abb47') then 'Optics Bridge'
     when TO_ADDRESS in ('0x533e3c0e6b48010873b947bddc4721b1bdff9648') then 'BSC Anyswap Bridge'
 
     when TO_ADDRESS in ('0x10c6b61dbf44a083aec3780acf769c77be747e23') then 'Moonriver Anyswap Bridge'
     when TO_ADDRESS in ('0x12ed69359919fc775bc2674860e8fe2d2b6a7b5d') then 'RSK Token Bridge'
     when TO_ADDRESS in ('0xabea9132b05a70803a4e85094fd0e1800777fbef') then 'ZkSync Bridge'
     when TO_ADDRESS in ('0xdc1664458d2f0b6090bea60a8793a4e66c2f1c00') then 'Boba Network Bridge'
 
     when TO_ADDRESS in ('0x1a2a1c938ce3ec39b6d47113c7955baa9dd454f2', '0x64192819ac13ef72bf6b5ae239ac672b43a9af08') then 'Axie Infinity: Ronin Bridge'
     when TO_ADDRESS in ('0x2796317b0ff8538f253012862c06787adfb8ceb6') then 'Synapse Bridge'
     when TO_ADDRESS in ('0x88a69b4e698a4b090df6cf5bd7b2d47325ad30a3') then 'Nomad Bridge'
   
     end as bridge,
     token_address, t.symbol, sum(RAW_AMOUNT/pow(10, decimals) * avg_price) as token_amount, decimals, COUNT(DISTINCT ORIGIN_FROM_ADDRESS) as users, COUNT(DISTINCT tx_hash) as tx_count
   
     from ethereum.core.fact_token_transfers a
     join prices t on t.token_address = a.CONTRACT_ADDRESS and date_trunc('day', a.BLOCK_TIMESTAMP) = t.day
     where TO_ADDRESS in ('0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0', '0x8eb8a3b98659cce290402893d0123abb75e3ab28', -- avalanche
             '0xf92cd566ea4864356c5491c177a430c222d7e678', -- solana wormhole
   '0x23ddd3e3692d1861ed57ede224608875809e127f', -- near
   '0x2dccdb493827e15a5dc8f8b72147e6c4a5620857', --harmony
   '0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe', -- fantom
   '0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf', '0x401f6c983ea34274ec46f84d70b31c151321188b', -- polygon
   '0x467194771dae2967aef3ecbedd3bf9a310c76c65', '0x99c9fc46f92e8a1c0dec1b1747d010903e884be1', '0x5fd79d46eba7f351fe49bff9e87cdea6c821ef9f', -- optimism
   '0xcee284f754e854890e311e3280b767f80797180d', '0xa3a7b6f88361f48403514059f1f16c8e78d60eec', '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f', -- arbitrum
   '0x88ad09518695c6c3712ac10a214be5109a655671', '0x4aa42145aa6ebf72e164c9bbc74fbd3788045016', --xdai
   '0x6a39909e805a3eadd2b61fff61147796ca6abb47', -- celo
   '0x533e3c0e6b48010873b947bddc4721b1bdff9648', -- bsc
   '0x10c6b61dbf44a083aec3780acf769c77be747e23', -- moon
   '0x12ed69359919fc775bc2674860e8fe2d2b6a7b5d', -- rsk
   '0xabea9132b05a70803a4e85094fd0e1800777fbef', -- zksync
   '0xdc1664458d2f0b6090bea60a8793a4e66c2f1c00', -- boba
   '0x1a2a1c938ce3ec39b6d47113c7955baa9dd454f2', '0x64192819ac13ef72bf6b5ae239ac672b43a9af08', --ronin
   '0x2796317b0ff8538f253012862c06787adfb8ceb6', -- synapse
   '0x88a69b4e698a4b090df6cf5bd7b2d47325ad30a3' -- nomad
   )
   and RAW_AMOUNT/pow(10, decimals) * avg_price > 0 and RAW_AMOUNT/pow(10, decimals) * avg_price < 5000000000
   group by 1, 2, 3, 4, 6
   order by 1
   
   )
 ),
   bridge_out as
 (select day as date, bridge, sum(token_amount) as tvl, sum(users) as users, sum(tx_count) as tx_count,
   avg(tvl) OVER(partition by bridge ORDER BY day ROWS BETWEEN 7 PRECEDING AND CURRENT ROW ) as ma_7day
 from all_data 
   where users > 20
   group by 1,2)
 
 select sum(ma_7day) as bridge_out, 
 date 
 from 
 bridge_out
 group by date
 order by date asc
 `
    },

    'bridge7': {
      result: null,
      sql: `with prices as (
   SELECT date(HOUR) as day, symbol, token_address, decimals, min(price) as avg_price
   from ethereum.core.fact_hourly_token_prices
   where SYMBOL not in ('DG', 'BORING')
   GROUP by day, token_address, symbol, decimals
 ),
 all_data as (
     select *
     from (
     select date_trunc('month', a.BLOCK_TIMESTAMP) as day,
     case when TO_ADDRESS in ('0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0', '0x8eb8a3b98659cce290402893d0123abb75e3ab28') then 'Avalanche Bridge'
     when TO_ADDRESS = '0xf92cd566ea4864356c5491c177a430c222d7e678' then 'Solana Wormhole'
     when TO_ADDRESS = '0x23ddd3e3692d1861ed57ede224608875809e127f' then 'Near Rainbow Bridge'
     when TO_ADDRESS = '0x2dccdb493827e15a5dc8f8b72147e6c4a5620857' then 'Harmony Bridges'
     when TO_ADDRESS = '0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe' then 'Fantom Anyswap Bridge'
     when TO_ADDRESS in ('0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf', '0x401f6c983ea34274ec46f84d70b31c151321188b' )then 'Polygon Bridges'
     when TO_ADDRESS in ('0x467194771dae2967aef3ecbedd3bf9a310c76c65', '0x99c9fc46f92e8a1c0dec1b1747d010903e884be1', '0x5fd79d46eba7f351fe49bff9e87cdea6c821ef9f' )then 'Optimism Bridges'
     when TO_ADDRESS in ('0xcee284f754e854890e311e3280b767f80797180d', '0xa3a7b6f88361f48403514059f1f16c8e78d60eec', '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f') then 'Arbitrum Bridges'
   
     when TO_ADDRESS in ('0x88ad09518695c6c3712ac10a214be5109a655671', '0x4aa42145aa6ebf72e164c9bbc74fbd3788045016') then 'Gnosis: xDAI Bridges'
     when TO_ADDRESS in ('0x6a39909e805a3eadd2b61fff61147796ca6abb47') then 'Optics Bridge'
     when TO_ADDRESS in ('0x533e3c0e6b48010873b947bddc4721b1bdff9648') then 'BSC Anyswap Bridge'
 
     when TO_ADDRESS in ('0x10c6b61dbf44a083aec3780acf769c77be747e23') then 'Moonriver Anyswap Bridge'
     when TO_ADDRESS in ('0x12ed69359919fc775bc2674860e8fe2d2b6a7b5d') then 'RSK Token Bridge'
     when TO_ADDRESS in ('0xabea9132b05a70803a4e85094fd0e1800777fbef') then 'ZkSync Bridge'
     when TO_ADDRESS in ('0xdc1664458d2f0b6090bea60a8793a4e66c2f1c00') then 'Boba Network Bridge'
 
     when TO_ADDRESS in ('0x1a2a1c938ce3ec39b6d47113c7955baa9dd454f2', '0x64192819ac13ef72bf6b5ae239ac672b43a9af08') then 'Axie Infinity: Ronin Bridge'
     when TO_ADDRESS in ('0x2796317b0ff8538f253012862c06787adfb8ceb6') then 'Synapse Bridge'
     when TO_ADDRESS in ('0x88a69b4e698a4b090df6cf5bd7b2d47325ad30a3') then 'Nomad Bridge'
   
     end as bridge,
     token_address, t.symbol, sum(RAW_AMOUNT/pow(10, decimals) * avg_price) as token_amount, decimals, COUNT(DISTINCT ORIGIN_FROM_ADDRESS) as users, COUNT(DISTINCT tx_hash) as tx_count
   
     from ethereum.core.fact_token_transfers a
     join prices t on t.token_address = a.CONTRACT_ADDRESS and date_trunc('day', a.BLOCK_TIMESTAMP) = t.day
     where TO_ADDRESS in ('0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0', '0x8eb8a3b98659cce290402893d0123abb75e3ab28', -- avalanche
             '0xf92cd566ea4864356c5491c177a430c222d7e678', -- solana wormhole
   '0x23ddd3e3692d1861ed57ede224608875809e127f', -- near
   '0x2dccdb493827e15a5dc8f8b72147e6c4a5620857', --harmony
   '0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe', -- fantom
   '0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf', '0x401f6c983ea34274ec46f84d70b31c151321188b', -- polygon
   '0x467194771dae2967aef3ecbedd3bf9a310c76c65', '0x99c9fc46f92e8a1c0dec1b1747d010903e884be1', '0x5fd79d46eba7f351fe49bff9e87cdea6c821ef9f', -- optimism
   '0xcee284f754e854890e311e3280b767f80797180d', '0xa3a7b6f88361f48403514059f1f16c8e78d60eec', '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f', -- arbitrum
   '0x88ad09518695c6c3712ac10a214be5109a655671', '0x4aa42145aa6ebf72e164c9bbc74fbd3788045016', --xdai
   '0x6a39909e805a3eadd2b61fff61147796ca6abb47', -- celo
   '0x533e3c0e6b48010873b947bddc4721b1bdff9648', -- bsc
   '0x10c6b61dbf44a083aec3780acf769c77be747e23', -- moon
   '0x12ed69359919fc775bc2674860e8fe2d2b6a7b5d', -- rsk
   '0xabea9132b05a70803a4e85094fd0e1800777fbef', -- zksync
   '0xdc1664458d2f0b6090bea60a8793a4e66c2f1c00', -- boba
   '0x1a2a1c938ce3ec39b6d47113c7955baa9dd454f2', '0x64192819ac13ef72bf6b5ae239ac672b43a9af08', --ronin
   '0x2796317b0ff8538f253012862c06787adfb8ceb6', -- synapse
   '0x88a69b4e698a4b090df6cf5bd7b2d47325ad30a3' -- nomad
   )
   and RAW_AMOUNT/pow(10, decimals) * avg_price > 0 and RAW_AMOUNT/pow(10, decimals) * avg_price < 5000000000
   group by 1, 2, 3, 4, 6
   order by 1
   )
 ),
   bridge as
 (select day, bridge, sum(token_amount) as tvl, sum(users) as users, sum(tx_count) as tx_count,
   avg(tvl) OVER(partition by bridge ORDER BY day ROWS BETWEEN 7 PRECEDING AND CURRENT ROW ) as ma_7day
 from all_data 
   where users > 20
   group by 1,2)
 
 select sum(ma_7day) as volume , bridge 
 from 
 bridge
   where 
   day>CURRENT_DATE-45
 group by 2
 `
    },



    'bridge8': {
      result: null,
      sql: `with prices as (
   SELECT date(HOUR) as day, symbol, token_address, decimals, avg(price) as avg_price
   from ethereum.core.fact_hourly_token_prices
   where SYMBOL not in ('DG', 'BORING') -- wrong prices
   GROUP by day, token_address, symbol, decimals
 ),
 all_data as (
     select *
     from (
     select date_trunc('month', a.BLOCK_TIMESTAMP) as day,
     case when FROM_ADDRESS in ('0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0', '0x8eb8a3b98659cce290402893d0123abb75e3ab28') then 'Avalanche Bridge'
     when FROM_ADDRESS = '0xf92cd566ea4864356c5491c177a430c222d7e678' then 'Solana Wormhole'
     when FROM_ADDRESS = '0x23ddd3e3692d1861ed57ede224608875809e127f' then 'Near Rainbow Bridge'
     when FROM_ADDRESS = '0x2dccdb493827e15a5dc8f8b72147e6c4a5620857' then 'Harmony Bridges'
     when FROM_ADDRESS = '0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe' then 'Fantom Anyswap Bridge'
     when FROM_ADDRESS in ('0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf', '0x401f6c983ea34274ec46f84d70b31c151321188b' )then 'Polygon Bridges'
     when FROM_ADDRESS in ('0x467194771dae2967aef3ecbedd3bf9a310c76c65', '0x99c9fc46f92e8a1c0dec1b1747d010903e884be1', '0x5fd79d46eba7f351fe49bff9e87cdea6c821ef9f' )then 'Optimism Bridges'
     when FROM_ADDRESS in ('0xcee284f754e854890e311e3280b767f80797180d', '0xa3a7b6f88361f48403514059f1f16c8e78d60eec', '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f') then 'Arbitrum Bridges'
   
     when FROM_ADDRESS in ('0x88ad09518695c6c3712ac10a214be5109a655671', '0x4aa42145aa6ebf72e164c9bbc74fbd3788045016') then 'Gnosis: xDAI Bridges'
     when FROM_ADDRESS in ('0x6a39909e805a3eadd2b61fff61147796ca6abb47') then 'Optics Bridge'
     when FROM_ADDRESS in ('0x533e3c0e6b48010873b947bddc4721b1bdff9648') then 'BSC Anyswap Bridge'
 
     when FROM_ADDRESS in ('0x10c6b61dbf44a083aec3780acf769c77be747e23') then 'Moonriver Anyswap Bridge'
     when FROM_ADDRESS in ('0x12ed69359919fc775bc2674860e8fe2d2b6a7b5d') then 'RSK Token Bridge'
     when FROM_ADDRESS in ('0xabea9132b05a70803a4e85094fd0e1800777fbef') then 'ZkSync Bridge'
     when FROM_ADDRESS in ('0xdc1664458d2f0b6090bea60a8793a4e66c2f1c00') then 'Boba Network Bridge'
 
     when FROM_ADDRESS in ('0x1a2a1c938ce3ec39b6d47113c7955baa9dd454f2', '0x64192819ac13ef72bf6b5ae239ac672b43a9af08') then 'Axie Infinity: Ronin Bridge'
     when FROM_ADDRESS in ('0x2796317b0ff8538f253012862c06787adfb8ceb6') then 'Synapse Bridge'
     when FROM_ADDRESS in ('0x88a69b4e698a4b090df6cf5bd7b2d47325ad30a3') then 'Nomad Bridge'
   
     end as bridge,
     token_address, t.symbol, sum(RAW_AMOUNT/pow(10, decimals) * avg_price) as token_amount, decimals,  COUNT(DISTINCT ORIGIN_FROM_ADDRESS) as users, COUNT(DISTINCT tx_hash) as tx_count
   
     from ethereum.core.fact_token_transfers a
     join prices t on t.token_address = a.CONTRACT_ADDRESS and date_trunc('day', a.BLOCK_TIMESTAMP) = t.day
     where FROM_ADDRESS in ('0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0', '0x8eb8a3b98659cce290402893d0123abb75e3ab28', -- avalanche
             '0xf92cd566ea4864356c5491c177a430c222d7e678', -- solana wormhole
   '0x23ddd3e3692d1861ed57ede224608875809e127f', -- near
   '0x2dccdb493827e15a5dc8f8b72147e6c4a5620857', --harmony
   '0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe', -- fantom
   '0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf', '0x401f6c983ea34274ec46f84d70b31c151321188b', -- polygon
   '0x467194771dae2967aef3ecbedd3bf9a310c76c65', '0x99c9fc46f92e8a1c0dec1b1747d010903e884be1', '0x5fd79d46eba7f351fe49bff9e87cdea6c821ef9f', -- optimism
   '0xcee284f754e854890e311e3280b767f80797180d', '0xa3a7b6f88361f48403514059f1f16c8e78d60eec', '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f', -- arbitrum
   '0x88ad09518695c6c3712ac10a214be5109a655671', '0x4aa42145aa6ebf72e164c9bbc74fbd3788045016', --xdai
   '0x6a39909e805a3eadd2b61fff61147796ca6abb47', -- celo
   '0x533e3c0e6b48010873b947bddc4721b1bdff9648', -- bsc
   '0x10c6b61dbf44a083aec3780acf769c77be747e23', -- moon
   '0x12ed69359919fc775bc2674860e8fe2d2b6a7b5d', -- rsk
   '0xabea9132b05a70803a4e85094fd0e1800777fbef', -- zksync
   '0xdc1664458d2f0b6090bea60a8793a4e66c2f1c00', -- boba
   '0x1a2a1c938ce3ec39b6d47113c7955baa9dd454f2', '0x64192819ac13ef72bf6b5ae239ac672b43a9af08', --ronin
   '0x2796317b0ff8538f253012862c06787adfb8ceb6', -- synapse
   '0x88a69b4e698a4b090df6cf5bd7b2d47325ad30a3' -- nomad
   )
     and RAW_AMOUNT/pow(10, decimals) * avg_price > 0 and RAW_AMOUNT/pow(10, decimals) * avg_price < 5000000000
     group by 1, 2, 3, 4, 6
     order by 1
     )
 ), 
   bridge as
 (select day, bridge, sum(token_amount) as tvl, sum(users) as users, sum(tx_count) as tx_count,
   avg(tvl) OVER(partition by bridge ORDER BY day ROWS BETWEEN 7 PRECEDING AND CURRENT ROW ) as ma_7day
 from all_data group by 1,2)
 select sum(ma_7day) as volume , bridge 
 from 
 bridge
   where 
   day>CURRENT_DATE-45
 group by 2
 `
    },
    'bridge9': {
      result: null,
      sql: `with prices as (
   SELECT date(HOUR) as day, symbol, token_address, decimals, avg(price) as avg_price
   from ethereum.core.fact_hourly_token_prices
   where SYMBOL not in ('DG', 'BORING')
   GROUP by day, token_address, symbol, decimals
 ),
 all_data as (
     select *
     from (
     select date_trunc('month', a.BLOCK_TIMESTAMP) as day,
     case when TO_ADDRESS in ('0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0', '0x8eb8a3b98659cce290402893d0123abb75e3ab28') then 'Avalanche Bridge'
     when TO_ADDRESS = '0xf92cd566ea4864356c5491c177a430c222d7e678' then 'Solana Wormhole'
     when TO_ADDRESS = '0x23ddd3e3692d1861ed57ede224608875809e127f' then 'Near Rainbow Bridge'
     when TO_ADDRESS = '0x2dccdb493827e15a5dc8f8b72147e6c4a5620857' then 'Harmony Bridges'
     when TO_ADDRESS = '0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe' then 'Fantom Anyswap Bridge'
     when TO_ADDRESS in ('0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf', '0x401f6c983ea34274ec46f84d70b31c151321188b' )then 'Polygon Bridges'
     when TO_ADDRESS in ('0x467194771dae2967aef3ecbedd3bf9a310c76c65', '0x99c9fc46f92e8a1c0dec1b1747d010903e884be1', '0x5fd79d46eba7f351fe49bff9e87cdea6c821ef9f' )then 'Optimism Bridges'
     when TO_ADDRESS in ('0xcee284f754e854890e311e3280b767f80797180d', '0xa3a7b6f88361f48403514059f1f16c8e78d60eec', '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f') then 'Arbitrum Bridges'
   
     when TO_ADDRESS in ('0x88ad09518695c6c3712ac10a214be5109a655671', '0x4aa42145aa6ebf72e164c9bbc74fbd3788045016') then 'Gnosis: xDAI Bridges'
     when TO_ADDRESS in ('0x6a39909e805a3eadd2b61fff61147796ca6abb47') then 'Optics Bridge'
     when TO_ADDRESS in ('0x533e3c0e6b48010873b947bddc4721b1bdff9648') then 'BSC Anyswap Bridge'
 
     when TO_ADDRESS in ('0x10c6b61dbf44a083aec3780acf769c77be747e23') then 'Moonriver Anyswap Bridge'
     when TO_ADDRESS in ('0x12ed69359919fc775bc2674860e8fe2d2b6a7b5d') then 'RSK Token Bridge'
     when TO_ADDRESS in ('0xabea9132b05a70803a4e85094fd0e1800777fbef') then 'ZkSync Bridge'
     when TO_ADDRESS in ('0xdc1664458d2f0b6090bea60a8793a4e66c2f1c00') then 'Boba Network Bridge'
 
     when TO_ADDRESS in ('0x1a2a1c938ce3ec39b6d47113c7955baa9dd454f2', '0x64192819ac13ef72bf6b5ae239ac672b43a9af08') then 'Axie Infinity: Ronin Bridge'
     when TO_ADDRESS in ('0x2796317b0ff8538f253012862c06787adfb8ceb6') then 'Synapse Bridge'
     when TO_ADDRESS in ('0x88a69b4e698a4b090df6cf5bd7b2d47325ad30a3') then 'Nomad Bridge'
   
     end as bridge,
     token_address, t.symbol, sum(RAW_AMOUNT/pow(10, decimals) * avg_price) as token_amount, decimals, COUNT(DISTINCT ORIGIN_FROM_ADDRESS) as users, COUNT(DISTINCT tx_hash) as tx_count
   
     from ethereum.core.fact_token_transfers a
     join prices t on t.token_address = a.CONTRACT_ADDRESS and date_trunc('day', a.BLOCK_TIMESTAMP) = t.day
     where TO_ADDRESS in ('0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0', '0x8eb8a3b98659cce290402893d0123abb75e3ab28', -- avalanche
             '0xf92cd566ea4864356c5491c177a430c222d7e678', -- solana wormhole
   '0x23ddd3e3692d1861ed57ede224608875809e127f', -- near
   '0x2dccdb493827e15a5dc8f8b72147e6c4a5620857', --harmony
   '0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe', -- fantom
   '0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf', '0x401f6c983ea34274ec46f84d70b31c151321188b', -- polygon
   '0x467194771dae2967aef3ecbedd3bf9a310c76c65', '0x99c9fc46f92e8a1c0dec1b1747d010903e884be1', '0x5fd79d46eba7f351fe49bff9e87cdea6c821ef9f', -- optimism
   '0xcee284f754e854890e311e3280b767f80797180d', '0xa3a7b6f88361f48403514059f1f16c8e78d60eec', '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f', -- arbitrum
   '0x88ad09518695c6c3712ac10a214be5109a655671', '0x4aa42145aa6ebf72e164c9bbc74fbd3788045016', --xdai
   '0x6a39909e805a3eadd2b61fff61147796ca6abb47', -- celo
   '0x533e3c0e6b48010873b947bddc4721b1bdff9648', -- bsc
   '0x10c6b61dbf44a083aec3780acf769c77be747e23', -- moon
   '0x12ed69359919fc775bc2674860e8fe2d2b6a7b5d', -- rsk
   '0xabea9132b05a70803a4e85094fd0e1800777fbef', -- zksync
   '0xdc1664458d2f0b6090bea60a8793a4e66c2f1c00', -- boba
   '0x1a2a1c938ce3ec39b6d47113c7955baa9dd454f2', '0x64192819ac13ef72bf6b5ae239ac672b43a9af08', --ronin
   '0x2796317b0ff8538f253012862c06787adfb8ceb6', -- synapse
   '0x88a69b4e698a4b090df6cf5bd7b2d47325ad30a3' -- nomad
   )
   and RAW_AMOUNT/pow(10, decimals) * avg_price > 0 and RAW_AMOUNT/pow(10, decimals) * avg_price < 5000000000
   group by 1, 2, 3, 4, 6
   order by 1
   )
 )
 select symbol, sum(token_amount) as tvl, sum(users) as users, sum(tx_count) as tx_count2,
   row_number() over (order by tvl DESC) as rank
 from all_data 
   where users > 20
 group by 1
 qualify rank <= 20
 `
    },



    'bridge10': {
      result: null,
      sql: `with prices as (
   SELECT date(HOUR) as day, symbol, token_address, decimals, avg(price) as avg_price
   from ethereum.core.fact_hourly_token_prices
   where SYMBOL not in ('DG', 'BORING')
   GROUP by day, token_address, symbol, decimals
 ),
 all_data as (
     select *
     from (
     select 
   token_address, t.symbol, sum(RAW_AMOUNT/pow(10, decimals) * avg_price) as token_amount, decimals,  COUNT(DISTINCT ORIGIN_FROM_ADDRESS) as users, COUNT(DISTINCT tx_hash) as tx_count
   
     from ethereum.core.fact_token_transfers a
     join prices t on t.token_address = a.CONTRACT_ADDRESS and date_trunc('day', a.BLOCK_TIMESTAMP) = t.day
     where FROM_ADDRESS in ('0xe78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0', '0x8eb8a3b98659cce290402893d0123abb75e3ab28', -- avalanche
             '0xf92cd566ea4864356c5491c177a430c222d7e678', -- solana wormhole
   '0x23ddd3e3692d1861ed57ede224608875809e127f', -- near
   '0x2dccdb493827e15a5dc8f8b72147e6c4a5620857', --harmony
   '0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe', -- fantom
   '0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf', '0x401f6c983ea34274ec46f84d70b31c151321188b', -- polygon
   '0x467194771dae2967aef3ecbedd3bf9a310c76c65', '0x99c9fc46f92e8a1c0dec1b1747d010903e884be1', '0x5fd79d46eba7f351fe49bff9e87cdea6c821ef9f', -- optimism
   '0xcee284f754e854890e311e3280b767f80797180d', '0xa3a7b6f88361f48403514059f1f16c8e78d60eec', '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f', -- arbitrum
   '0x88ad09518695c6c3712ac10a214be5109a655671', '0x4aa42145aa6ebf72e164c9bbc74fbd3788045016', --xdai
   '0x6a39909e805a3eadd2b61fff61147796ca6abb47', -- celo
   '0x533e3c0e6b48010873b947bddc4721b1bdff9648', -- bsc
   '0x10c6b61dbf44a083aec3780acf769c77be747e23', -- moon
   '0x12ed69359919fc775bc2674860e8fe2d2b6a7b5d', -- rsk
   '0xabea9132b05a70803a4e85094fd0e1800777fbef', -- zksync
   '0xdc1664458d2f0b6090bea60a8793a4e66c2f1c00', -- boba
   '0x1a2a1c938ce3ec39b6d47113c7955baa9dd454f2', '0x64192819ac13ef72bf6b5ae239ac672b43a9af08', --ronin
   '0x2796317b0ff8538f253012862c06787adfb8ceb6', -- synapse
   '0x88a69b4e698a4b090df6cf5bd7b2d47325ad30a3' -- nomad
   )
   and RAW_AMOUNT/pow(10, decimals) * avg_price > 0 and RAW_AMOUNT/pow(10, decimals) * avg_price < 5000000000
   group by 1, 2, 4
   order by 1
   )
 )
 select symbol, token_amount as tvl, users, tx_count,
   row_number() over (order by tvl DESC) as rank
 from all_data
   where users > 20
 group by 1,2,3,4
 qualify rank <= 20
 `
    },
    'stak': {
      result: null,
      sql: `select 
      sum(case when ACTION in ('TokensCommitted','DelegatorTokensCommitted') then AMOUNT else null end ) as satke,
        sum(case when ACTION in ('DelegatorUnstakedTokensWithdrawn','UnstakedTokensWithdrawn') then AMOUNT else null end ) as unstke,
        sum(case when ACTION in ('DelegatorRewardTokensWithdrawn','RewardTokensWithdrawn') then AMOUNT else null end ) as get_reward,
        count(distinct DELEGATOR) AS total_users ,
        count(distinct NODE_ID) AS total_NODE_ID, satke-unstke as locked
        ,
        date_trunc('week',BLOCK_TIMESTAMP) as date , 
        sum(satke) over (order by date) as c_stake , 
        sum(unstke) over (order by date) as c_unstake , 
        sum(get_reward) over (order by date) as c_get_reward , 
         c_stake-c_unstake as net_flow
        
      from 
      flow.core.ez_staking_actions
        group by date
        order by date asc
  `
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
