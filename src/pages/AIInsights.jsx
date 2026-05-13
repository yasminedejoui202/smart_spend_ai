import MobileNav from '../components/MobileNav'

const insights = [
  {
    title: 'Food spending increased',
    text: 'You spent 30% more on food this week compared with your weekly average.',
    tone: 'from-indigo-500 to-cyan-500',
  },
  {
    title: 'Optimization suggestion',
    text: 'Suggestion: reduce unnecessary expenses by setting a weekly shopping limit.',
    tone: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Recurring bills detected',
    text: 'Your bills are stable. Consider reviewing subscriptions once per month.',
    tone: 'from-amber-500 to-orange-500',
  },
]

function AIInsights() {
  return (
    <div className="space-y-6">
      <MobileNav />
      <section className="page-shell overflow-hidden">
        <div className="relative rounded-[2rem] bg-slate-950 p-8 text-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-indigo-950">
          <div className="absolute right-6 top-6 text-6xl opacity-20">🤖</div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-300">
            Coming soon
          </p>
          <h2 className="mt-3 max-w-2xl text-4xl font-black">
            AI Insights placeholder
          </h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            This page is ready for a future AI service. For now, it displays example financial insights and recommendations.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {insights.map((insight) => (
            <article
              key={insight.title}
              className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <div className={`mb-5 h-2 w-20 rounded-full bg-gradient-to-r ${insight.tone}`} />
              <h3 className="text-lg font-black text-slate-950 dark:text-white">
                {insight.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {insight.text}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AIInsights