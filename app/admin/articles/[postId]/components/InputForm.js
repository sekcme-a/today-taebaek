import { useEffect } from "react";
import { TextField, Checkbox } from "@mui/material";

const InputForm = ({
  title,
  subtitle,
  author,
  createdAt,
  content,
  setTitle,
  setSubtitle,
  setAuthor,
  setCreatedAt,
  setContent,
  isHeadline,
  setIsHeadline,
  isPublished,
  setIsPublished,
  isEditorPick,
  setIsEditorPick,
  isBreakingNews,
  setIsBreakingNews,
}) => {
  return (
    <>
      <div className="flex items-center mb-4">
        <Checkbox
          checked={isHeadline}
          onChange={(e) => setIsHeadline(e.target.checked)}
          color="blue"
        />
        <p>헤드라인</p>
        <Checkbox
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          color="blue"
        />
        <p>게재중</p>
        <Checkbox
          checked={isBreakingNews}
          onChange={(e) => setIsBreakingNews(e.target.checked)}
          color="blue"
        />
        <p>속보</p>
        <Checkbox
          checked={isEditorPick}
          onChange={(e) => setIsEditorPick(e.target.checked)}
          color="blue"
        />
        <p>에디터 픽</p>
      </div>
      <TextField
        label="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4"
        fullWidth
        size="small"
        required
      />
      <TextField
        label="부제목"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        className="mb-4"
        fullWidth
        size="small"
      />
      <TextField
        label="기자"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="mb-4"
        required
        fullWidth
        size="small"
      />
      <TextField
        label="작성일"
        type="date"
        value={createdAt}
        onChange={(e) => setCreatedAt(e.target.value)}
        className="mb-4"
        required
        fullWidth
        size="small"
      />

      <p className="text-sm pt-4 whitespace-pre-line">
        {`이미지를 기사 내용 중간에 삽입하시려면 아래의 형식으로 작성하세요.\n[[[이미지 번호]]]<<<이미지 설명>>>`}
      </p>
      <TextField
        multiline
        label="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        variant="standard"
        required
        rows={10}
        fullWidth
      />
    </>
  );
};

export default InputForm;
