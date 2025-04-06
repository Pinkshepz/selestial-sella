export default async function fetchUrlPreview ({
    url
}: {
    url: string
}) {
  let results: any = "";
  fetch(url).then(response => {
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    results = response.status;
  }).then(
    data => {console.log(data)}
  ).catch(
    error => console.error("Fetch error:", error)
  );
  return results;
}
