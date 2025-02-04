interface NodeType {
  type: "node--page";
  id: string;
  field_paragraphs: any;
  status: boolean;
  title: string;
  path: {
    alias: string;
    langcode: "en" | "fr" | "ar";
  };
}

export const ParagraphWrapper = ({ node }: { node: NodeType }) => {
  return node.field_paragraphs.data.map((paragraph: any) => {
    switch (paragraph?.type) {
      case "paragraph--introduction":
        return <ParagraphIntroduction paragraph={paragraph} />;
    }
  });
};

const ParagraphIntroduction = ({ paragraph }: any) => {
  return (
    <div data-paragraph-type={paragraph.type} data-paragraph-id={paragraph.id}>
      <div
        dangerouslySetInnerHTML={{ __html: paragraph.field_description.value }}
      ></div>

      <img
        height={200}
        width={200}
        src={`http://localhost:8888/${paragraph.field_image.data.field_media_image.data.uri.url}`}
      />
    </div>
  );
};
