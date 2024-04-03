import Card from "../page/card";

const AboutUs = () => {
  return (
    <Card title="About Us">
      <p className="my-2">
        The Laboratory for Knowledge Discovery in Databases (KDD) is a research
        group in the Computing and Information Sciences (CIS) Department at
        Kansas State University. Its research emphasis is in the areas of
        applied artificial intelligence (AI) and knowledge-based software
        engineering (KBSE) for decision support systems.
      </p>
      <p className="my-2">
        More specifically, we are interested in machine learning, data mining
        and knowledge discovery from large spatial and temporal databases,
        human-computer intelligent interaction (HCII), and high-performance
        computation in learning and optimization. In our research, we look for
        ways to systematically decompose analytical learning problems based upon
        information theoretic and probabilistic criteria, so that the most
        appropriate machine learning methods may be applied to the resulting
        transformed problems.
      </p>
      <p className="my-2">
        One of the major challenges in this area is the design of unsupervised
        learning and bias (or hyperparameter) optimization methods to produce an
        effective decomposition of learning tasks. An interesting opportunity
        presented by this problem is that, by addressing the high-level control
        of inductive learning in a statistically sound fashion, we can improve
        our techniques for both model selection and model integration (as
        practiced in multimodal sensor fusion). We have developed and applied
        such approaches to multistrategy learning, which are potentially
        computation-intensive, to interesting analytical problems in the areas
        of decision support (uncertain reasoning) and control automation.
      </p>
      <p className="my-2">
        The goal of our work is to gain insight into the interaction between
        artifacts that adapt or learn - whether by Bayesian, neural, or genetic
        computation - and their users. Important examples of this interaction
        include data visualization in intelligent displays, software agents for
        distributed high-performance computation and information retrieval, and
        virtual environments for simulation and computer-assisted instruction.
      </p>
    </Card>
  );
};

export default AboutUs;
