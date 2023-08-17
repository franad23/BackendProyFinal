import User from '../models/user.model.js';
import Form from '../models/form.model.js';
import FormToResp from '../models/formToResp.model.js';
import { verifyToken } from '../middlewares/verifyToken.js';

export const postNewForm = async (req, res) => {
  const {titleForm, typeForm, typeIdentify, urlImgPort, questionsForm} = req.body;
  try {
    const userId = req.userIdFromToken;
    const userFound = await User.findById(userId);
    if (!userFound) return res.status(400).json(({message:"userId not exists"}));
    const newForm = new Form ({
      userId: userId, 
      titleForm: titleForm, 
      typeForm: typeForm, 
      typeIdentify: typeIdentify, 
      urlImgPort: urlImgPort, 
      questionsForm: questionsForm
    })
    const formSaved = await newForm.save();
    res.send(formSaved)
  } catch (error) {
    console.log(error);
  }
}

export const gettingUserAllForms = async (req, res) => {
  const userId = req.userIdFromToken;
  try {
    const userFound = await User.findById(userId);
    if (!userFound) return res.status(400).json(({message:"userId not exists"}));
    const userAllForms = await Form.find({userId: userId});
    res.send(userAllForms);
  } catch (error) { 
    console.log(error);
  }
}

export const gettingForm = async (req, res) => {
  const userId = req.userIdFromToken;
  const idForm = req.params.id;
  try {
    const formFound = await Form.findById(idForm);
    if (!formFound) return res.status(404).json(({message:"Form Not Found"}))
    if (formFound.userId !== userId) return res.status(400).json(({message:"Bad Request"}))
    res.send(formFound)
} catch (error) {
  console.log(error);
}
}

export const gettingFormToResp = async (req, res) => {
  const idForm = req.params.id;
  try {
    const formFound = await Form.findById(idForm);
    if (!formFound) return res.status(404).json(({message:"Form Not Found"}))
    res.send(formFound)
} catch (error) {
  console.log(error);
}
}

export const deleteForm = async (req, res) => {
  const userId = req.userIdFromToken;
  const idForm = req.params.id;
  try {
    const formToDelete = await Form.findById(idForm);
    if (!formToDelete) return res.status(400).json({ message: "No Existe formulario" });
    if (formToDelete.userId !== userId) return res.status(400).json({ message: "Bad Request" });

    // Eliminar registros relacionados en FormToResp
    await FormToResp.deleteMany({ formId: idForm, userId });

    await Form.findByIdAndDelete(idForm);

    return res.status(200).json({ message: "Formulario Eliminado" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const modifyForm = async (req, res) => {
  const userId = req.userIdFromToken;
  const idForm = req.params.id;
  const { titleForm, typeForm, typeIdentify, urlImgPort, questionsForm } = req.body;
  
  try {
    const userFound = await User.findById(userId);
    if (!userFound) return res.status(200).json(({ message: "userId not exists" }));
    
    const updatedForm = {
      titleForm: titleForm,
      typeForm: typeForm,
      typeIdentify: typeIdentify,
      urlImgPort: urlImgPort,
      questionsForm: questionsForm
    };

    const updatedResult = await Form.findOneAndUpdate(
      { _id: idForm, userId: userId },
      updatedForm,
    );
    if (!updatedResult) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.json(updatedResult);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postUserForm = async (req, res) => {
  const idForm = req.params.id;
  const {userId, formId, titleForm, typeForm, typeIdentify, userAnswers, identify} = req.body;
  try {
    const formFound = await Form.findById(idForm);
    if (!formFound) return res.status(400).json(({message:"No Existe formulario"}));
    if (!userId) return res.status(400).json(({message:"No Existe usuario"}));
    const newFormToResp = new FormToResp ({
      userId: userId, 
      formId: formId, 
      titleForm:titleForm,
      typeForm: typeForm, 
      typeIdentify: typeIdentify, 
      userAnswers: userAnswers,
      identify: identify
    })
    const formToRespSaved = await newFormToResp.save();
    res.send(formToRespSaved);
  } catch (error) {
    console.log(error);
  }
}

export const gettingResponses = async (req, res) => {
  const idForm = req.params.id;
  const userId = req.userIdFromToken;
  try {
    const responses = await FormToResp.find({
      formId: idForm,
      userId: userId
    });

    res.status(200).json(responses);
  } catch (error) {
    console.log(error);
  }
}