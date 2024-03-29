import React from "react";

const PageTitle = ({ children, extra }) => {//hiển thị tiêu đề và nội dung phụ của 1 UI
  return (
    <div className="page_title">
      <div className="page_title_content">{children}</div>
      {extra && <div className="page_title_extra">{extra}</div>}
    </div>
  );
};

export default PageTitle;
