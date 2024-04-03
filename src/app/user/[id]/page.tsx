export default function Page({ params }: { params: { id: string } }) {
  return <div className="grow">My User: {params.id}</div>;
}
