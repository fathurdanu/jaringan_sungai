import { Handle, Position } from "reactflow";

const Embung = (data) => {
  const { label } = data.data;
  return (
    <div
      style={{
        border: "3px solid #9ca8b3",
        padding: "14px",
        borderRadius: "5px",
        width: "120px",
        height: "12px",
      }}
    >
      <label>{label}</label>
      <Handle
        type="source"
        position={Position.Bottom}
        id={data.id}
        isConnectable
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id={data.id}
        isConnectable
      />
    </div>
  );
};

export default Embung;
