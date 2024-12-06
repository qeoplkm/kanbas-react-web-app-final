import { useParams } from "react-router-dom";

interface AddPathParametersProps {
  a?: string;
  b?: string;
}

export default function AddPathParameters({ a: propA, b: propB }: AddPathParametersProps) {
  const params = useParams();
  const a = propA || params.a;
  const b = propB || params.b;

  return (
    <div id="wd-add">
      <h4>Add Path Parameters</h4>
      {a} + {b} = {parseInt(a as string) + parseInt(b as string)}
    </div>
  );
}