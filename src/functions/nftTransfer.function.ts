export default async function nftTransfer(userAddress:string){
    const url = `https://roobet-leaderboard-and-multiplier-socket-u65qg4m2pa-ew.a.run.app/nft?publicKey=${userAddress}&network=polygon`
    const result = await fetch(url).then((response)=>{
        return response.status
    }).catch((error)=>{
        log("Error fetching NFT",error);
        return 400 
    });
    return result 
}