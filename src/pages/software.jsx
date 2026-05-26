import Layout from '@theme/Layout';

export default function SoftwareFallback() {
  return (
    <Layout title="Software" description="SiMa.ai software documentation.">
      <main style={{padding: '3rem 1.5rem'}}>
        <div className="container">
          <h1>Software</h1>
          <p>This route is served by Vulcan CloudFront routing in deployed environments.</p>
        </div>
      </main>
    </Layout>
  );
}
