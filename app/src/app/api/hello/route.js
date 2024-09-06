import {NextResponse} from 'next/server';

let items=[];

//GET
export async function GET(){
    return NextResponse.json(items);
}

//POST

export async function POST(request){
    try{
        const data=await request.json()
        items.push(data)
        return NextResponse.json({received:data}, {status:201})
    }catch(error){
        return NextResponse.json({message:'Error'}, {status:500})
    }
}

//PUT

export async function PUT(request){
    try{
        const {id,updatedItem} = await request.json()
        items=items.map(item => item.id === id ? updatedItem: item)
        return NextResponse.json({updated:updatedItem})
    }catch(error){
        return NextResponse.json({message:'Error'}, {status:500})
    }
}

//Delete

export async function DELETE(request){
    try{
        const {searchParams} =new URL(request.url)
        const deletedId=searchParams.get('deletedId')
        items=items.filter(item => item.id !== deletedId)
        return NextResponse.json({message:'Resource deleted'})
    }catch(error){
        return NextResponse.json({message:'Error'},)
    }
}