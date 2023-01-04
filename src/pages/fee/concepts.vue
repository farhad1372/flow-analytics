<template>
    <div class="row">
    
        <div calss="col-12">
    
            <img src="@/assets/images/cost.webp" style="width: 100%" />
    
    
            <h2 class="mt-10">Fees</h2>
    
            <p>
    
                There are two types of fees that occur on the Flow blockchain: variable transaction fees and storage fees.<br />
    
            </p>
    
            <h2 class="mt-10">Segmented Transaction Fees</h2>
    
            <p>
    
                Transaction fees are applied only once per transaction, at time of execution..<br /> Transactions without a valid payer signature will fail and not be included in a block, prior to when the fee would be.<br /> charged. If there is no one to
    
                charge, the transaction never goes through..<br /> If a transaction fails for some other reason, you will still be charged. The fee covers the cost of the network looking<br /> at the transaction and thus must be paid even if no change to
    
                your account is made.<br /> Transaction fees are charged based upon how much work is done by the transaction during execution, including<br /> creating accounts, reading and updating state, and executing of cadence logic.<br />
    
            </p>
    
            <h2 class="mt-10">Storage/Account Fees</h2>
    
            <p>
    
               The account creation fee is applied only when a new account is created. This fee covers the cost of storing up to<br />
               100kB of data in perpetuity. This fee is applied only once and can be "topped up" to add additional storage to an<br />
               account.<br />
    
            </p>
    
           
    
           
    
   
    
        </div>
    
    </div>
</template>
