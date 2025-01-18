"use strict";

/* Package System */
import React from "react";
import Link from "next/link";

/* Package Application */
import FormLayout from "@views/Admin/Components/FormLayout";

/* Package style */

class Form extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        {/* TYPE : text,status,radio,select,select_multi,image,video,textarea,autoComplete (multiple:true),password,dateTime
          col:'left', col:'right',editor
          hideColRight={true} -- ẩn cột phải
        */}
        <FormLayout
          // getData={{ account_id: "accounts?limit=10000&fqnull=deleted_at" }}
          fields={[
            {
              key: "header",
              label: "Tiêu đề",
              type: "text",
              col: "left",
              isRequied: true,
            },
            {
              key: "content",
              label: "Nội dung",
              type: "editor",
              col: "left",
              isRequied: true,
            },
            {
              key: "new_imgae",
              label: "Ảnh",
              type: "image",
              cdn: process.env.API_URL + "/",
              col: "left",
              isRequied: true,
            },
            {
              key: "status",
              label: "Trạng thái",
              type: "status",
              defaultValue: true,
              col: "right",
            },
          ]}
        />
      </>
    );
  }
}

export default Form;
