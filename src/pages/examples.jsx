import Layout from '@theme/Layout';

export default function ExamplesFallback() {
  return (
    <Layout title="Examples" description="SiMa.ai application examples.">
      <main style={{padding: '3rem 1.5rem'}}>
        <div className="container">
          <h1>Examples</h1>
          <p>This route is served by Vulcan CloudFront routing in deployed environments.</p>
        </div>
      </main>
    </Layout>
  );
}
