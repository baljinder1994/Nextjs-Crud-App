"use client"
import { ChakraProvider } from '@chakra-ui/react'
import {
  Box,Button,Container,FormControl,Input,List,ListItem,Stack,Text,useToast,VSToast,
  VStack,FormLabel
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function Home(){
  const[items,setItems]=useState([])
  const [newItem,setNewItem]=useState('')
  const[editItem,setEditItem]=useState(null)
  const toast=useToast()


  useEffect(() =>{
    async function fetchItems(){
      const response=await fetch('/api/hello')
      const data=await response.json()
      setItems(data)
    }
    fetchItems()
  },[])

  const handleAddItem=async() =>{
    const response= await fetch('/api/hello',{
      method:'POST',

      headers:{ 'Content-Type':'application/json'},
      body:JSON.stringify({ id: Date.now(), name:newItem})
    })
    const data=await response.json();
    setItems([...items,data.received])
    setNewItem('')
    toast({
      title:'Item Added',
      description:`The item "${newItem}" has been added`,
        status:'success',
        duration:3000,
        isClosable:true,
    })
    

  }

  const handleUpdateItem=async() =>{
    const response= await fetch('/api/hello', {
      method:'PUT',
      headers:{ 'Content-Type':'application/json'},
      body:JSON.stringify({ id:editItem.id, updatedItem:{...editItem, name:newItem}})
    })
    const data=await response.json()
    setItems(items.map(item => item.id === editItem.id ? data.updated:item ))
    setEditItem(null)
    setNewItem('')
    toast({
      title:'Item Updates',
      description:`The item "${newItem}" has been updated`,
        status:'success',
        duration:3000,
        isClosable:true,
    })
  }
  const handleDelete=async(id) =>{
     const response=await fetch(`/api/hello?deletedId=${id}`,
       {method:'DELETE'})
       const data=await response.json()
       if(data.message === 'Resource deleted'){
        setItems(items.filter(item => item.id !== id));
        toast({
          title:'Item Deleted',
          description:`The item "${newItem}" has been deleted`,
            status:'success',
            duration:3000,
            isClosable:true,
        })
      }
  }
  return(
    <>
    <ChakraProvider>
       <Container maxW="container.md" py={10}>
        <VStack spacing={5} align="stretch">
          <Box>
            <Text fontSize="2xl" mb={4} fontWeight="bold">Items</Text>
             <FormControl id="item-name" mb={4}>
              <FormLabel>Item Name</FormLabel>
              <Input
               type="text"
               value={newItem}
               onChange={(e) => setNewItem(e.target.value)}
               placeholder="Enter Item Name"
              ></Input>
             </FormControl>
             <Button 
               colorScheme={editItem ? 'blue' :'teal'}

               onClick={editItem ? handleUpdateItem : handleAddItem}
             >{editItem ? 'Update' : 'Add'}</Button>
          </Box>
          <Box>
            <List spacing={3}>
              {items.map(item =>(
                  <ListItem key={item.id}
                    p={4}
                    borderWidth={1}
                    borderRadius="md"
                    boxShadow="md"
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Text>{item.name}</Text>
                    <Stack direction="row" spacing={3}>
                         <Button colorScheme="blue" onClick={() => setEditItem(item)}>Edit</Button>
                         <Button colorScheme="red" onClick={() => handleDelete(item.id)}>Delete</Button>
                    </Stack>
                  </ListItem >
              ))}
            
            </List>
          </Box>
        </VStack>
       </Container>
    </ChakraProvider>
    </>
  )
}