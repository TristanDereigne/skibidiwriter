import { useParams } from "react-router";

export const EditPage = () => {
  const { documentId } = useParams();

  return "edit " + documentId;
};
