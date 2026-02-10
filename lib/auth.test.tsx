import { resolve } from "path";

function sum(a:number,b:number){
    return a+b;
}

test("Result should be 5",()=>{
    expect(sum(2,3)).toBe(5);
        expect(sum(2,13)).not.toBe(5);

})

test("object assignment",()=>{
    const data={one:1}
    data["two"]=2;
    expect(data).toEqual({one:1,two:2})

})

async function Kesa(){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve("I am going to be resolved")
        },500)
    })
}
test("async result should be ",async()=>{
    const dataRes=await Kesa();
    expect(dataRes).toEqual("I am going to be resolved")
})