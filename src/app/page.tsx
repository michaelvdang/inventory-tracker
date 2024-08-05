'use client'
import Image from "next/image";
import Navbar from "./components/navbar";
import { useEffect, useState } from 'react';
import { db } from './utils/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { join } from "path";
import { onAuthStateChanged } from "./utils/auth";
import { useUserContext } from "./MyContext";
import { useRouter } from "next/navigation";

interface InventoryItemType {
  id?: string;
  name: string;
  quantity: string;
  price: string;
  ownerId?: string;
  ownerName?: string;
};

export default function Home() {
  // const data = [
  //   { name: "banana", quantity: 5, price: 0.99 },
  //   { name: "orange", quantity: 10, price: 0.69 },
  //   { name: "apple", quantity: 15, price: 0.89 },
  //   { name: "grape", quantity: 20, price: 1.29 },
  // ]
  const { user, setUser } = useUserContext();
  // const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [showOthers, setShowOthers] = useState(false);
  const [inventory, setInventory] = useState<InventoryItemType[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [itemUpdating, setItemUpdating] = useState<InventoryItemType | undefined>();
  const [inventoryItem, setInventoryItem] = useState({
    name: '',
    quantity: '',
    price: ''
  })
  const router = useRouter();

  useEffect(() => {
    // Fetch data from Firestore
    const fetchData = async () => {
      
      // const snapshot = await db.collection('inventory').get();
      // snapshot.forEach((doc: any) => {
      //   console.log(doc.id, '=>', doc.data());
      // });
      const results : InventoryItemType[] = [];

      try {
        const snapshot = await getDocs(collection(db, 'inventory'));
        snapshot.forEach((doc: any) => {
          const data = doc.data();
          console.log(doc.id, '=>', { ...data, id: doc.id });
          results.push({ ...data, id: doc.id });
        });
        setInventory(results);
      }
      catch (error) {
        console.error(error);
      }
      return;
    };

    // if (!user && router) {
    //   router.push("/login");
    // }
    fetchData();
  }, [user, router]);

  const handleChange = (e: any) => {
    setInventoryItem({
      ...inventoryItem,
      [e.target.name]: e.target.value
    })
  }

  const addDocument = async () => {
    if (!inventoryItem.name || !inventoryItem.quantity || !inventoryItem.price) {
      alert("Please fill out all fields");
      return;
    }
    if (isNaN(Number(inventoryItem.quantity)) || isNaN(Number(inventoryItem.price))) {
      alert("Quantity and price must be numbers");
      return;
    }

    try {
      if (user && user.displayName) {
        const docRef = await addDoc(collection(db, 'inventory'), {...inventoryItem, ownerId: user.uid, ownerName: user.displayName});
        console.log("Document written with ID: ", docRef.id);
        if (inventory) {
          setInventory([...inventory, {...inventoryItem, id: docRef.id, ownerId: user.uid, ownerName: user.displayName}]);
        }
        else {
          setInventory([ {...inventoryItem, id: docRef.id, ownerId: user.uid, ownerName: user.displayName} ]);
        }
        setInventoryItem({name: '', quantity: '', price: ''});
      }
      else {
        alert('Please login to add items');
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  
  const deleteDocument = async (id: string) => {
    console.log('delete document: ' + id);
    try {
      await deleteDoc(doc(db, 'inventory', id));
      setInventory(inventory.filter((item) => item.id !== id));
      console.log("Document successfully deleted!");
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const updateDocument = async (item: InventoryItemType) => {
    if (isUpdating) {
      console.log('update document: ' + item.id);
      try {
        if (!item.name || !item.quantity || !item.price) {
          alert("Please fill out all fields");
          return;
        }
        if (!user) {
          alert('Please login to update items');
          return;
        }
        if (!item || !item.id) {
          return;
        }
        const docRef = doc(db, 'inventory', item.id);
        await updateDoc(docRef, {...item, ownerId: user.uid, ownerName: user.displayName});
        console.log("Document successfully updated!");
        setInventory(inventory.map((i) => i.id === item.id ? item : i));
      } catch (e) {
        console.error("Error updating document: ", e, 'name: ', item.name, 'quantity: ', item.quantity, 'price: ', item.price);
        alert("Error updating document: " + e + ' name: ' + item.name + ' quantity: ' + item.quantity + 'price: ' + item.price)
      }
      setIsUpdating(false);
    }
    else {
      setItemUpdating(item);
      setIsUpdating(true);
    }
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handle update change: ' + e.target.name);
    console.log(e.target.value);
    console.log(itemUpdating);
    if (itemUpdating) {
      setItemUpdating({
        ...itemUpdating,
        [e.target.name]: e.target.value
      })
    }
  };
  
  return (
    <main className="flex min-h-screen justify-center overflow-auto">
      <Navbar showOthers={showOthers} setShowOthers={setShowOthers} />
      {/* container */}
      <div
        className="pt-10 h-screen max-w-7xl flex grow flex-col "
      >
        
        {/* form */}
        <div
          className="flex flex-col justify-center items-center py-4"
        >
          <h1
            className="text-3xl font-bold mb-4"
          >Add an item</h1>
          <form
            className="flex flex-col gap-x-4 lg:flex-row items-baseline"
            onSubmit={(e) => e.preventDefault()}
            action="submit"
          >
            <label
              className="block mt-2 text-sm font-medium text-white"
              htmlFor="name"
            >Name</label>
            <input
              className="p-2 rounded-md text-black dark:text-white"
              type="text"
              name="name"
              value={inventoryItem.name}
              onChange={handleChange}
            />
            <label
              className="block mt-2 text-sm font-medium text-white"
              htmlFor="quantity"
            >Quantity</label>
            <input
              className="p-2 rounded-md text-black dark:text-white"
              type="text"
              name="quantity"
              value={inventoryItem.quantity}
              onChange={handleChange}
            />
            <label
              className="block mt-2 text-sm font-medium text-white"
              htmlFor="price"
            >Price</label>
            <input
              className="p-2 rounded-md text-black dark:text-white"
              type="text"
              name="price"
              value={inventoryItem.price}
              onChange={handleChange}
            />
            <div
              className="flex justify-center items-center w-full pt-2"
            >
              <button
                className="btn btn-primary bg-purple-900 hover:bg-purple-600 text-white p-4"
                onClick={addDocument}
              >Add</button>
            </div>
          </form>
        </div>
        {/* list 1 */}
        <div
          className="flex flex-col justify-center items-center py-4"
        >
          <h1
            className="text-3xl font-bold mb-4 text-center"
          >Current Inventory for</h1>
          <h1
            className="text-3xl font-bold mb-4 text-center"
          >{user?.displayName ? `${user.displayName}` : ''}</h1>
          <div
            className="overflow-x-auto border-2 border-white rounded-md"
          >
            <div
              // className="w-full"
            >
              <table
                className="table-auto"
              >
                <thead>
                  <tr className="text-left align-baseline">
                    {/* <th>OwnerID</th> */}
                    <th
                      className="sticky left-0 z-10 pr-4 py-2"
                    >Owner Name</th>
                    <th
                      className="sticky left-0 z-10 pr-4 py-2"
                    >Name</th>
                    <th
                      className="sticky left-0 z-10 pr-4 py-2"
                    >Quantity</th>
                    <th
                      className="sticky left-0 z-10 pr-4 py-2"
                    >Price ($)</th>
                    <th
                      className="sticky left-0 z-10 pr-4 py-2"
                    >Update</th>
                    <th
                      className="sticky left-0 z-10 pr-4 py-2"
                    >Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {inventory.filter((item) => item.ownerId === user?.uid).map((item) => (
                    <tr
                      key={item.name}
                      className="text-left align-baseline"
                    >
                      {/* <td>{item.ownerId}</td> */}
                      <td
                        className="sticky left-0 z-10 pr-4 py-2"
                      >{item.ownerName}</td>
                      <td
                        className="sticky left-0 z-10 pr-4 py-2"
                      >
                        {isUpdating && item.id === itemUpdating?.id ? (
                          <input
                            className="bg-slate-400 text-white placeholder:text-white"
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={itemUpdating?.name}
                            onChange={handleUpdateChange}
                          />
                        ) : (
                          <div>{item.name}</div>
                        )}
                      </td>
                      <td
                        className="sticky left-0 z-10 pr-4 py-2"
                      >{isUpdating && item.id === itemUpdating?.id ? (
                          <input
                            className="bg-slate-400 text-white placeholder:text-white"
                            type="text"
                            placeholder="Quantity"
                            name="quantity"
                            value={itemUpdating?.quantity}
                            onChange={handleUpdateChange}
                          />
                        ) : (
                          <div>{item.quantity}</div>
                        )}</td>
                      <td
                        className="sticky left-0 z-10 pr-4 py-2"
                      >{isUpdating && item.id === itemUpdating?.id ? (
                          <input
                            className="bg-slate-400 text-white placeholder:text-white"
                            type="text"
                            placeholder="Price"
                            name="price"
                            value={itemUpdating?.price}
                            onChange={handleUpdateChange}
                          />
                        ) : (
                          <div>{(Math.round(Number(item.price) * 100) / 100).toFixed(2)}</div>
                        )}</td>
                      <td
                        className="sticky left-0 z-10 pr-4 py-2"
                      >
                        {isUpdating && item.id === itemUpdating?.id ? (
                          <button
                            className="btn btn-primary bg-purple-900 p-2"
                            onClick={() => itemUpdating && updateDocument(itemUpdating)}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary bg-slate-400 hover:bg-slate-400 p-4 border-2"
                            onClick={() => updateDocument(item)}
                          >Update</button>
                        )}
                      </td>
                      <td
                        className="sticky left-0 z-10 pr-4 py-2"
                      >
                        <button
                          className="btn btn-primary bg-purple-900 p-2"
                          onClick={() => item.id && deleteDocument(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* list 2 */}
        {showOthers && <div
          className="bg-yellow-900 flex flex-col justify-center items-center"
        >
          <h1>Inventory by All</h1>
          <table
            className="w-5/6 table-auto"
          >
            <thead>
              <tr className="text-left">
                <th>Owner Name</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {inventory.map((item) => (
                <tr
                  key={item.name}
                  className="text-left"
                >
                  <td>{item.ownerName}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>
                    <button
                      className="btn btn-primary bg-purple-900 p-2"
                      onClick={() => item.id && deleteDocument(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
             ))}
            </tbody>
            </table>
        </div>
        }
      </div>
    </main>
  );
}
