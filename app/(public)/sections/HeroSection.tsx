import styles from '../home.module.css';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBadge}>AI-First Intelligence Infrastructure</div>
      <h1>
        The Intelligence Platform That Costs
        <br />
        <em>$200K Elsewhere.</em> Starts Free.
      </h1>
      <p className={styles.heroSub}>
        Dataminr charges $20,000/mo. Crisis24 quotes six figures. Centinela gives you
        AI-generated, human-verified security intelligence for Latin America — starting
        with a free daily brief. Built by a 25-year operator, powered by our own GPU cluster.
      </p>

      <div className={styles.heroSubscribeCard}>
        <div className={styles.heroSubscribeHeadline}>
          Get the free daily brief
        </div>
        <p className={styles.heroSubscribeDesc}>
          The same LatAm intelligence that enterprise firms charge $20K/mo for — delivered
          free to your inbox every morning. Join security directors, GCs, and risk teams
          who start their day with Centinela.
        </p>
        <form className={styles.heroSubscribeForm} action="/api/subscribe" method="POST">
          <input type="email" name="email" placeholder="Enter your work email" required />
          <button type="submit" className="btn-primary">Subscribe Free</button>
        </form>
        <p className={styles.heroSubscribeFine}>
          Free forever. No credit card. Unsubscribe anytime.{' '}
          <a href="/briefs/latest">Read today&apos;s brief &rarr;</a>
        </p>
      </div>

      <div className={styles.heroProof}>
        <div className={styles.proofItem}>
          <div className="number">Owned</div>
          <div className="label">GPU Infrastructure</div>
        </div>
        <div className={styles.proofItem}>
          <div className="number">22</div>
          <div className="label">Countries Monitored</div>
        </div>
        <div className={styles.proofItem}>
          <div className="number">1/10th</div>
          <div className="label">The Cost of Dataminr</div>
        </div>
      </div>
    </section>
  );
}
