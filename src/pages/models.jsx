import Layout from '@theme/Layout';

export default function ModelsFallback() {
  return (
    <Layout title="Models" description="SiMa.ai model browser.">
      <main style={{padding: '3rem 1.5rem'}}>
        <div className="container">
          <h1>Models</h1>
          <p>This route is served by Vulcan CloudFront routing in deployed environments.</p>
        </div>
      </main>
    </Layout>
  );
}
