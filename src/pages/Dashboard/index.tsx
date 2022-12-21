import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import Food from '../../components/Food';

import api from '../../services/api';

import { FoodsContainer } from './styles';

import { FoodItem } from '../../@types/food';

export function Dashboard () {

  const [ foods, setFoods ] = useState<FoodItem[]>([] as FoodItem[]);
  const [ editingFood, setEditingFood ] = useState<FoodItem>({} as FoodItem);

  const [ modalOpen, setModalOpen ] = useState<boolean>(false);
  const [ editModalOpen, setEditModalOpen ] = useState<boolean>(false);

  useEffect(() => {
    try {
      api.get('/foods').then(response => setFoods(response.data))
    } catch (error) {
      console.log(error);
    }
  }, [])

  async function handleAddFood (food: FoodItem) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods(prevFoods => [...prevFoods, response.data])
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood (food: FoodItem) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood (id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal () {
    setModalOpen(current => !current);
  }

  function toggleEditModal () {
    setEditModalOpen(current => !current);
  }

  function handleEditFood (food: FoodItem) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
