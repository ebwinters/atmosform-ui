import React, { useState } from "react";
// @ts-ignore
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "../DroppableStrict";
import { FaGripVertical } from "react-icons/fa";
import { Question, QuestionType } from "../dto/Question";
import { Button, TextField, Box, Typography, Container, Paper } from '@mui/material';

export interface FormBuilderProps {
  onClickSubmit: (title: string, questions: Question[], description?: string) => void;
}

export const FormBuilder = (props: FormBuilderProps) => {
  const [formTitle, setFormTitle] = useState<string>(""); // Form Title state
  const [formDescription, setFormDescription] = useState<string>(""); // Form Description state
  const [questions, setQuestions] = useState<Question[]>([]);

  // Add a new question (text or multiple choice)
  const addQuestion = (questionType: QuestionType) => {
    if (questions.length >= 10) {
      alert("You can only add up to 10 questions.");
      return;
    }
    setQuestions([
      ...questions,
      {
        id: `question-${Date.now()}`,
        questionType,
        title: "",
        questionOptions: questionType === "multiplechoice" ? [{text: "Option 1"}, {text: "Option 2"}] : [],
      },
    ]);
  };

  // Update the title of a question
  const updateQuestionTitle = (id: string, newTitle: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, title: newTitle } : q))
    );
  };

  // Update options for multiple-choice questions
  const updateOption = (questionId: string, optionIndex: number, newOption: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              questionOptions: q.questionOptions?.map((opt, idx) =>
                idx === optionIndex ? {text: newOption } : opt
              ),
            }
          : q
      )
    );
  };

  // Add a new option to a multiple-choice question
  const addOption = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              questionOptions: [
                ...(q.questionOptions || []),
                { text: `Option ${(q.questionOptions?.length || 0) + 1}` },
              ],
            }
          : q
      )
    );
  };

  // Remove an option from a multiple-choice question
  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              questionOptions: q.questionOptions?.filter((_, idx) => idx !== optionIndex),
            }
          : q
      )
    );
  };

  // Remove a question
  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Reorder questions using drag-and-drop
  const onDragEnd = (result: any) => {
    if (!result.destination) return; // Dropped outside the list
    const reorderedQuestions = Array.from(questions);
    const [removed] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, removed);
    setQuestions(reorderedQuestions);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Form Builder
        </Typography>
        
        <TextField
          label="Enter Form Title"
          variant="outlined"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Enter Form Description"
          variant="outlined"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button variant="contained" color="primary" onClick={() => addQuestion(QuestionType.Text)}>
            Add Text Question
          </Button>
          <Button variant="contained" color="secondary" onClick={() => addQuestion(QuestionType.MultipleChoice)}>
            Add Multiple Choice Question
          </Button>
        </Box>

        <DragDropContext onDragEnd={onDragEnd}>
          <StrictModeDroppable droppableId="questions">
            {(provided: any) => (
              <div style={{width: '100%'}} {...provided.droppableProps} ref={provided.innerRef}>
                {questions.map((question, index) => (
                  <Draggable key={question.id} draggableId={question.id} index={index}>
                    {(provided: any) => (
                      <Paper
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          padding: 2,
                          mb: 2,
                          border: '1px solid #ccc',
                          borderRadius: 2,
                          background: '#f9f9f9',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <FaGripVertical />
                          <TextField
                            label="Enter Question Title"
                            variant="outlined"
                            value={question.title}
                            onChange={(e) => updateQuestionTitle(question.id!, e.target.value)}
                            fullWidth
                            sx={{ ml: 2 }}
                          />
                        </Box>

                        {question.questionType === QuestionType.MultipleChoice && (
                          <Box sx={{ mb: 2 }}>
                            {question.questionOptions?.map((option, idx) => (
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} key={idx}>
                                <TextField
                                  label={`Option ${idx + 1}`}
                                  variant="outlined"
                                  value={option.text}
                                  onChange={(e) =>
                                    updateOption(question.id!, idx, e.target.value)
                                  }
                                  fullWidth
                                  sx={{ mr: 1 }}
                                />
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() => removeOption(question.id!, idx)}
                                >
                                  X
                                </Button>
                              </Box>
                            ))}
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => addOption(question.id!)}
                            >
                              Add Option
                            </Button>
                          </Box>
                        )}

                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => removeQuestion(question.id!)}
                        >
                          Remove Question
                        </Button>
                      </Paper>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => props.onClickSubmit(formTitle, questions, formDescription)}
          sx={{ mt: 3 }}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default FormBuilder;