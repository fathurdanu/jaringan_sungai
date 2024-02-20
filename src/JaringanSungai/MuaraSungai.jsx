import { Handle, Position } from "reactflow";

const MuaraSungai = (data) => {
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
      <Handle
        type="target"
        position={Position.Top}
        id={data.id}
        isConnectable
      />
      <label>{label}</label>
    </div>
  );
};

export default MuaraSungai;
