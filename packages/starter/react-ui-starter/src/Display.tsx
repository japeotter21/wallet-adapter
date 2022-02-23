import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import React, { useEffect, useState  } from 'react';
import { getParsedNftAccountsByOwner, isValidSolanaAddress, createConnectionConfig} from "@nfteyez/sol-rayz";
import axios from "axios";
  
const opts = {
    preflightCommitment: "processed"
  }
   
 export function Display() {
  
  const [nftData, setNftData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addr, setAddr] = useState("");
  const ownerToken = addr;
//get NFT
const getAllNftData = async () => {
  
  try {   
        
        if (localStorage.getItem("k"))
        {
          if (ownerToken != localStorage.getItem("k"))
          {
            setAddr(localStorage.getItem("k").toString());
          }
        }
        // else if (localStorage.getItem("k") === null)
        // {
        //   setAddr("blank");
        // }
        const connect =  createConnectionConfig(clusterApiUrl("devnet"));      
        const nfts = await getParsedNftAccountsByOwner({
        publicAddress: ownerToken,
        connection: connect,
      });
      return nfts;
    }
   catch (error) {
    console.log(error);
  }
};
//Function to get all nft data
const getNftTokenData = async () => {
    console.log("hhhhhhhhhh")
    try {
      const nftData = await getAllNftData();
      const data = Object.keys(nftData).map((key) => nftData[key]); 
      console.log("kkkk", data)     
      const arr = [];
      const n = data.length;
      for (let i = 0; i < n; i++) {
        
        const val = await axios.get(data[i].data.uri);
        //if (val.data.name === "red")
        //{
        arr.push(val);
        //}
      }
      console.log("arr:", arr)
      return arr;
    
    } catch (error) {
      console.log(error);
    }
};

getNftTokenData().then(result => {
  const arr1 = result;
});

useEffect(() => {
  async function data() {
    const res = await getNftTokenData();
    setNftData(res);
    setLoading(true);
  }
  data();
}, []);


  return (    
      <div>
      <h1>NFTs</h1>
  <div>
    {loading ? (
      <>
        {nftData &&
          nftData.length > 0 &&
          nftData.map((val, ind) => {
            return (
              <div key={ind}>
                <div>
                  <div>
                    <img src={val.data.image} alt="loading..." />
                    <p>{val.data.name}</p>
                    <h6>
                      {val.data.description}
                    </h6>
                  </div>
                </div>
              </div>
            );
          })}
      </>
    ) : (
      <>
        <p>loading...</p>
      </>
    )}
  </div>
</div>
  )

}