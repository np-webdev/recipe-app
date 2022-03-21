import React from "react";
import { db } from "./firebase.config";
import { useState, useEffect } from "react";
import {
	collection,
	onSnapshot,
	doc,
	addDoc,
	deleteDoc,
} from "firebase/firestore";

const App = () => {
	const [recipes, setRecipes] = useState([]);
	const [form, setForm] = useState({
		title: "",
		desc: "",
		ingredients: [],
		steps: [],
		image: "",
	});
	const [popupActive, setPopupActive] = useState(false);

	const recipesCollectionRef = collection(db, "recipes");

	useEffect(() => {
		onSnapshot(recipesCollectionRef, (snapshot) => {
			setRecipes(
				snapshot.docs.map((doc) => {
					return {
						id: doc.id,
						viewing: false,
						...doc.data(),
						//data() Ruft alle Felder des Dokuments als Objekt ab.
					};
				})
			);
			console.log(snapshot);
		});
	}, []);

	const handleView = (id) => {
		const recipesClone = [...recipes];
		recipesClone.forEach((recipe) => {
			if (recipe.id === id) {
				recipe.viewing = !recipe.viewing;
			} else {
				recipe.viewing = false;
			}
		});
		setRecipes(recipesClone);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.title || !form.desc || !form.ingredients || !form.steps) {
			alert("Please fill out all fields");
			return;
		}
		addDoc(recipesCollectionRef, form);

		setForm({
			title: "",
			desc: "",
			ingredients: [],
			steps: [],
			image: "",
		});
    setPopupActive(false); 
	};

	const handleIngredient = (e, i) => {
		const ingredientClone = [...form.ingredients];
		ingredientClone[i] = e.target.value;
		setForm({
			...form,
			ingredients: ingredientClone,
		});
	};

	const handleStep = (e, i) => {
		const stepsClone = [...form.steps];
		stepsClone[i] = e.target.value;
		setForm({
			...form,
			steps: stepsClone,
		});
	};

	const handleIngredientCount = () => {
		setForm({
			...form,
			ingredients: [...form.ingredients, ""],
		});
	};

	const handleStepCount = () => {
		setForm({
			...form,
			steps: [...form.steps, ""],
		});
	};

	const removeRecipe = (id) => {
		deleteDoc(doc(db, "recipes", id));
	};
	return (
		<div className="App">
			<h1>My recipes app</h1>
			<button onClick={() => setPopupActive(!popupActive)}>Add recipe</button>

			<div className="recipes">
				{recipes.map((recipe) => (
					<div className="recipe" key={recipe.id}>
						<h3>{recipe.title}</h3>
						<p dangerouslySetInnerHTML={{ __html: recipe.desc }}></p>
						{recipe.viewing && (
							<div>
								<img className="img" src={recipe.image} alt={recipe.desc} />
								<h4>Ingredients</h4>
								<ul>
									{recipe.ingredients.map((ingredient, i) => (
										<li key={i}>{ingredient}</li>
									))}
								</ul>
								<h4>Steps</h4>
								<ol>
									{recipe.steps.map((step, i) => (
										<li key={i}>{step}</li>
									))}
								</ol>
							</div>
						)}
						<div className="buttons">
							<button onClick={() => handleView(recipe.id)}>
								View {recipe.viewing ? "less" : "more"}
							</button>
							<button
								onClick={() => removeRecipe(recipe.id)}
								className="remove"
							>
								Remove
							</button>
						</div>
					</div>
				))}
			</div>
			{popupActive && (
				<div className="popup">
					<div className="popup-inner">
						<h2>Add a new recipe</h2>
						<form onSubmit={handleSubmit}>
							<div className="form-group">
								<label>Title</label>
								<input
									type="text"
									value={form.title}
									onChange={(e) => setForm({ ...form, title: e.target.value })}
								/>
							</div>

							<div className="form-group">
								<label>Image URL</label>
								<input
									type="text"
									value={form.image}
									onChange={(e) => setForm({ ...form, image: e.target.value })}
								/>
							</div>
							<div className="form-group">
								<label>Description</label>
								<textarea
									type="text"
									value={form.desc}
									onChange={(e) => setForm({ ...form, desc: e.target.value })}
								/>
							</div>

							<div className="form-group">
								<label>Ingredients</label>
								{form.ingredients.map((ingredient, i) => (
									<input
										type="text"
										key={i}
										value={ingredient}
										onChange={(e) => handleIngredient(e, i)}
									/>
								))}
								<button type="button" onClick={handleIngredientCount}>
									Add ingredient
								</button>
							</div>

							<div className="form-group">
								<label>Steps</label>
								{form.steps.map((step, i) => (
									<textarea
										type="text"
										key={i}
										value={step}
										onChange={(e) => handleStep(e, i)}
									/>
								))}
								<button type="button" onClick={handleStepCount}>
									Add Step
								</button>
							</div>
							<div className="buttons">
								<button onSubmit={() => handleSubmit()} type="submit">
									Submit
								</button>
								<button
									type="button"
									className="remove"
									onClick={() => setPopupActive(false)}
								>
									Close
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default App;