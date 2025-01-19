import React, { useState } from "react";
// @ts-ignore
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./DroppableStrict";
import { FaGripVertical } from "react-icons/fa";


export interface Question {
  id: string;
  type: string;
  title: string;
  options: string[];
}

export interface FormBuilderProps {
  onClickSubmit: (questions: Question[]) => void;
}

export const FormBuilder = (props: FormBuilderProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);

  // Add a new question (text or multiple choice)
  const addQuestion = (type: string) => {
    if (questions.length >= 10) {
      alert("You can only add up to 10 questions.");
      return;
    }
    setQuestions([
      ...questions,
      {
        id: `question-${Date.now()}`,
        type,
        title: "",
        options: type === "multiple-choice" ? ["Option 1", "Option 2"] : [],
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
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? newOption : opt
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
          ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] }
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
              options: q.options.filter((_, idx) => idx !== optionIndex),
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
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Form Builder</h2>

      {/* Add Question Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => addQuestion("text")}>Add Text Question</button>
        <button onClick={() => addQuestion("multiple-choice")}>
          Add Multiple Choice Question
        </button>
      </div>

      {/* Drag-and-Drop Context */}
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="questions">
          {(provided: any) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {questions.map((question, index) => (
                <Draggable
                  key={question.id}
                  draggableId={question.id}
                  index={index}
                >
                  {(provided: any) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      style={{
                        padding: "10px",
                        marginBottom: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        background: "#f9f9f9",
                        ...provided.draggableProps.style,
                      }}
                    >
                      {/* Drag Handle */}
                      <div
                          {...provided.dragHandleProps}
                          style={{
                            cursor: "grab",
                            display: "inline-block",
                            paddingRight: "10px",
                          }}
                        >
                          <FaGripVertical />
                        </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Enter question title"
                          value={question.title}
                          onChange={(e) =>
                            updateQuestionTitle(question.id, e.target.value)
                          }
                          style={{
                            width: "100%",
                            marginBottom: "10px",
                            padding: "5px",
                          }}
                        />
                        {question.type === "multiple-choice" && (
                          <div>
                            {question.options.map((option, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: "5px",
                                }}
                              >
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) =>
                                    updateOption(
                                      question.id,
                                      idx,
                                      e.target.value
                                    )
                                  }
                                  style={{ flex: 1, padding: "5px" }}
                                />
                                <button
                                  onClick={() =>
                                    removeOption(question.id, idx)
                                  }
                                  style={{
                                    marginLeft: "5px",
                                    background: "red",
                                    color: "white",
                                  }}
                                >
                                  X
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => addOption(question.id)}
                              style={{
                                marginTop: "10px",
                                background: "green",
                                color: "white",
                                padding: "5px",
                              }}
                            >
                              Add Option
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => removeQuestion(question.id)}
                          style={{
                            marginTop: "10px",
                            background: "red",
                            color: "white",
                            padding: "5px",
                          }}
                        >
                          Remove Question
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>

      {/* Add submit Button */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => props.onClickSubmit(questions)}>submit</button>
      </div>
    </div>
  );
};

export default FormBuilder;
