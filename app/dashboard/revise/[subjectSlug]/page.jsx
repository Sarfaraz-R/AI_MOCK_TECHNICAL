import { notFound } from "next/navigation";
import { buildRevisionDeck, getSubjectBySlug } from "../_data/revisionDeck";
import RevisionDeckExperience from "./_components/RevisionDeckExperience";

const SubjectRevisionPage = ({ params }) => {
  const subject = getSubjectBySlug(params.subjectSlug);

  if (!subject) {
    notFound();
  }

  const deck = buildRevisionDeck(subject, 50);

  return <RevisionDeckExperience subject={subject} subjectSlug={params.subjectSlug} deck={deck} />;
};

export default SubjectRevisionPage;
