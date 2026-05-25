import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Hardware() {
  return (
    <Layout
      title="SiMa.ai Hardware"
      description="Overview of SiMa.ai hardware platforms and DevKit bring-up entry points">
      <main style={{padding: '3rem 1.5rem'}}>
        <div className="container">
          <h1>SiMa.ai Hardware</h1>
          <p>
            SiMa.ai hardware platforms are designed for edge AI systems that need local model
            execution, camera and video interfaces, wired networking, and board-level control close
            to the sensor or application workload.
          </p>
          <p>
            The hardware documentation starts with the Modalix DevKit because it is the primary
            development platform for current SiMa.ai software and firmware validation.
          </p>

          <h2>Platform Overview</h2>
          <p>
            The Modalix DevKit combines application processors, dedicated acceleration, onboard
            storage, peripheral I/O, display output, and network connectivity in a development
            enclosure.
          </p>

          <h2>Development Flow</h2>
          <p>
            Start with serial access, then establish network connectivity, verify the board image,
            and install the software stack needed for your project.
          </p>

          <p>
            For first-time board setup, continue with{' '}
            <Link to="/docs/hardware/setup-devkit">Set up your DevKit</Link>.
          </p>
        </div>
      </main>
    </Layout>
  );
}
