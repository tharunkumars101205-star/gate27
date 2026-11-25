import type { SyllabusSubject } from '../types/study';

export const GATE_2027_ECE_SYLLABUS: SyllabusSubject[] = [
  {
    id: 'engineering-mathematics',
    code: 'EM',
    name: 'Engineering Mathematics',
    chapters: [
      {
        id: 'em-linear-algebra',
        title: 'Linear Algebra',
        topics: [
          { id: 'em-la-1', title: 'Vector spaces and subspaces, linear dependence and independence' },
          { id: 'em-la-2', title: 'Matrix algebra, determinants, and rank of a matrix' },
          { id: 'em-la-3', title: 'Systems of linear equations (homogeneous and non-homogeneous)' },
          { id: 'em-la-4', title: 'Eigenvalues and eigenvectors, Cayley-Hamilton theorem' },
          { id: 'em-la-5', title: 'Symmetric, skew-symmetric, Hermitian, orthogonal, and unitary matrices' },
          { id: 'em-la-6', title: 'Matrix diagonalization and LU / QR decompositions' },
        ],
      },
      {
        id: 'em-calculus',
        title: 'Calculus',
        topics: [
          { id: 'em-calc-1', title: 'Mean value theorems, Taylor and Maclaurin series expansions' },
          { id: 'em-calc-2', title: 'Theorems of integral calculus and evaluation of definite/improper integrals' },
          { id: 'em-calc-3', title: 'Partial derivatives, total derivatives, maxima and minima (single & multi-variable)' },
          { id: 'em-calc-4', title: 'Multiple integrals (double and triple integrals), area and volume' },
          { id: 'em-calc-5', title: 'Fourier series of periodic functions and half-range expansions' },
        ],
      },
      {
        id: 'em-differential-equations',
        title: 'Differential Equations',
        topics: [
          { id: 'em-de-1', title: 'First-order ordinary differential equations (linear and non-linear)' },
          { id: 'em-de-2', title: 'Higher-order linear ODEs with constant coefficients' },
          { id: 'em-de-3', title: 'Cauchy-Euler equations and method of variation of parameters' },
          { id: 'em-de-4', title: 'Initial and boundary value problems, Laplace transform solutions' },
          { id: 'em-de-5', title: 'Partial differential equations and separation of variables' },
        ],
      },
      {
        id: 'em-vector-analysis',
        title: 'Vector Analysis',
        topics: [
          { id: 'em-va-1', title: 'Vectors in plane and space, vector operations, directional derivatives' },
          { id: 'em-va-2', title: 'Gradient, divergence, and curl; solenoidal and irrotational fields' },
          { id: 'em-va-3', title: 'Line, surface, and volume integrals' },
          { id: 'em-va-4', title: 'Gauss divergence theorem, Stokes theorem, and Green theorem' },
        ],
      },
      {
        id: 'em-complex-analysis',
        title: 'Complex Analysis',
        topics: [
          { id: 'em-ca-1', title: 'Analytic functions and Cauchy-Riemann equations' },
          { id: 'em-ca-2', title: 'Cauchy integral theorem and Cauchy integral formula' },
          { id: 'em-ca-3', title: 'Taylor and Laurent series, singularities and poles' },
          { id: 'em-ca-4', title: 'Residue theorem and evaluation of real integrals' },
        ],
      },
      {
        id: 'em-probability-statistics',
        title: 'Probability and Statistics',
        topics: [
          { id: 'em-ps-1', title: 'Sampling theorems, conditional probability, and Bayes theorem' },
          { id: 'em-ps-2', title: 'Mean, median, mode, variance, and standard deviation' },
          { id: 'em-ps-3', title: 'Random variables, PDF, CDF, and moments' },
          { id: 'em-ps-4', title: 'Discrete distributions (Binomial, Poisson) and Continuous distributions (Uniform, Normal, Exponential)' },
          { id: 'em-ps-5', title: 'Joint distributions, correlation, covariance, and linear regression' },
        ],
      },
    ],
  },
  {
    id: 'network-theory',
    code: 'NT',
    name: 'Network Theory',
    chapters: [
      {
        id: 'nt-circuit-analysis',
        title: 'Circuit Analysis & Graph Theory',
        topics: [
          { id: 'nt-ca-1', title: 'KCL, KVL, node and mesh analysis with independent and dependent sources' },
          { id: 'nt-ca-2', title: 'Network graphs, incidence matrix, cut-set and tie-set matrices' },
          { id: 'nt-ca-3', title: 'Superposition, Thevenin, Norton, and Maximum Power Transfer theorems' },
          { id: 'nt-ca-4', title: 'Reciprocity, Tellegen, and Compensation theorems' },
          { id: 'nt-ca-5', title: 'Star-Delta transformation and magnetically coupled circuits' },
        ],
      },
      {
        id: 'nt-sinusoidal-steady-state',
        title: 'Sinusoidal Steady-State Analysis',
        topics: [
          { id: 'nt-sss-1', title: 'Phasors, impedance, admittance, and AC network analysis' },
          { id: 'nt-sss-2', title: 'Active, reactive, apparent power, complex power, and power factor' },
          { id: 'nt-sss-3', title: 'Series and parallel resonance, Q-factor, bandwidth, and selectivity' },
        ],
      },
      {
        id: 'nt-transient-laplace',
        title: 'Time-Domain & Frequency-Domain Analysis',
        topics: [
          { id: 'nt-tl-1', title: 'First-order RC and RL circuits (natural and forced response)' },
          { id: 'nt-tl-2', title: 'Second-order RLC circuits (overdamped, critically damped, underdamped)' },
          { id: 'nt-tl-3', title: 'Initial and final value conditions in s-domain circuit analysis' },
          { id: 'nt-tl-4', title: 'Network functions (driving point and transfer), poles, zeros, and frequency response' },
        ],
      },
      {
        id: 'nt-two-port',
        title: 'Two-Port Networks',
        topics: [
          { id: 'nt-tp-1', title: 'Z, Y, ABCD (transmission), h, and g parameters and interconversions' },
          { id: 'nt-tp-2', title: 'Symmetry and reciprocity conditions in two-port parameters' },
          { id: 'nt-tp-3', title: 'Interconnection of two-port networks (series, parallel, cascade)' },
        ],
      },
    ],
  },
  {
    id: 'signals-and-systems',
    code: 'SS',
    name: 'Signals and Systems',
    chapters: [
      {
        id: 'ss-basics',
        title: 'Continuous & Discrete-Time Signals & Systems',
        topics: [
          { id: 'ss-b-1', title: 'Elementary signals, signal transformations, energy and power signals' },
          { id: 'ss-b-2', title: 'System properties (linearity, time-invariance, causality, stability, memory, invertibility)' },
          { id: 'ss-b-3', title: 'Impulse response, continuous-time and discrete-time convolution' },
          { id: 'ss-b-4', title: 'LTI system characterization via differential and difference equations' },
        ],
      },
      {
        id: 'ss-fourier',
        title: 'Fourier Series & Fourier Transform',
        topics: [
          { id: 'ss-f-1', title: 'Continuous-Time Fourier Series (CTFS) and properties' },
          { id: 'ss-f-2', title: 'Continuous-Time Fourier Transform (CTFT), Parseval theorem, energy/power spectral density' },
          { id: 'ss-f-3', title: 'Discrete-Time Fourier Series (DTFS) and Discrete-Time Fourier Transform (DTFT)' },
          { id: 'ss-f-4', title: 'Frequency response of LTI systems, ideal and practical filters' },
        ],
      },
      {
        id: 'ss-laplace-z',
        title: 'Laplace Transform & Z-Transform',
        topics: [
          { id: 'ss-lz-1', title: 'Bilateral and unilateral Laplace Transform, Region of Convergence (ROC)' },
          { id: 'ss-lz-2', title: 'Z-Transform, ROC properties, inverse Z-transform' },
          { id: 'ss-lz-3', title: 'Pole-zero locations, causality, and BIBO stability in s-plane and z-plane' },
        ],
      },
      {
        id: 'ss-sampling-dft',
        title: 'Sampling Theorem & DFT',
        topics: [
          { id: 'ss-sd-1', title: 'Sampling theorem, Nyquist rate, aliasing, and signal reconstruction' },
          { id: 'ss-sd-2', title: 'Discrete Fourier Transform (DFT), circular convolution, and FFT basics' },
        ],
      },
    ],
  },
  {
    id: 'electronic-devices',
    code: 'ED',
    name: 'Electronic Devices',
    chapters: [
      {
        id: 'ed-semiconductor-physics',
        title: 'Semiconductor Physics & Carrier Transport',
        topics: [
          { id: 'ed-sp-1', title: 'Energy bands in intrinsic and extrinsic silicon, direct and indirect bandgap' },
          { id: 'ed-sp-2', title: 'Equilibrium carrier concentration, Fermi-Dirac distribution, mass action law' },
          { id: 'ed-sp-3', title: 'Drift and diffusion currents, Einstein relation, Hall effect' },
          { id: 'ed-sp-4', title: 'Generation, recombination, continuity equation, and excess carrier lifetime' },
        ],
      },
      {
        id: 'ed-pn-junction',
        title: 'P-N Junction & Special Diodes',
        topics: [
          { id: 'ed-pn-1', title: 'P-N junction electrostatics, built-in potential, depletion width, and capacitance' },
          { id: 'ed-pn-2', title: 'I-V characteristics, breakdown mechanisms (Zener and Avalanche)' },
          { id: 'ed-pn-3', title: 'Zener diode, Tunnel diode, Varactor diode, and Metal-Semiconductor (Schottky) junctions' },
        ],
      },
      {
        id: 'ed-bjt-mosfet',
        title: 'BJT, JFET & MOSFET Physics',
        topics: [
          { id: 'ed-bm-1', title: 'BJT structure, carrier transport, current gain, Early effect, Ebers-Moll model' },
          { id: 'ed-bm-2', title: 'MOS capacitor, C-V characteristics, flat-band voltage, and threshold voltage' },
          { id: 'ed-bm-3', title: 'MOSFET regions of operation, I-V equations, body effect, and channel-length modulation' },
          { id: 'ed-bm-4', title: 'Short-channel effects and CMOS device scaling basics' },
        ],
      },
      {
        id: 'ed-optoelectronics',
        title: 'Optoelectronic Devices',
        topics: [
          { id: 'ed-op-1', title: 'LEDs, Photodiodes, PIN diodes, and Solar Cells (fill factor, efficiency)' },
          { id: 'ed-op-2', title: 'Semiconductor Lasers (population inversion and threshold condition)' },
        ],
      },
    ],
  },
  {
    id: 'analog-circuits',
    code: 'AC',
    name: 'Analog Circuits',
    chapters: [
      {
        id: 'ac-diode-circuits',
        title: 'Diode Circuits',
        topics: [
          { id: 'ac-dc-1', title: 'Half-wave, full-wave, and bridge rectifiers with capacitive filters' },
          { id: 'ac-dc-2', title: 'Clippers, clampers, peak detectors, and voltage multipliers' },
          { id: 'ac-dc-3', title: 'Zener diode shunt voltage regulators' },
        ],
      },
      {
        id: 'ac-transistor-amplifiers',
        title: 'BJT & MOSFET Amplifiers',
        topics: [
          { id: 'ac-ta-1', title: 'DC biasing schemes, operating point (Q-point), and thermal stability' },
          { id: 'ac-ta-2', title: 'Small-signal hybrid-pi and T models of BJT and MOSFET' },
          { id: 'ac-ta-3', title: 'Single-stage amplifiers (CE/CS, CB/CG, CC/CD) — gain, input/output impedance' },
          { id: 'ac-ta-4', title: 'Current mirrors, active loads, and differential amplifiers (CMRR, differential gain)' },
          { id: 'ac-ta-5', title: 'Multistage amplifiers and frequency response (low-frequency and Miller effect)' },
        ],
      },
      {
        id: 'ac-feedback-oscillators',
        title: 'Feedback Amplifiers & Oscillators',
        topics: [
          { id: 'ac-fo-1', title: 'Four negative feedback topologies (voltage-series, current-series, voltage-shunt, current-shunt)' },
          { id: 'ac-fo-2', title: 'Barkhausen criterion, RC phase-shift and Wien bridge oscillators' },
          { id: 'ac-fo-3', title: 'LC oscillators (Hartley, Colpitts) and crystal oscillators' },
        ],
      },
      {
        id: 'ac-opamps',
        title: 'Operational Amplifiers & Applications',
        topics: [
          { id: 'ac-oa-1', title: 'Ideal and practical op-amp characteristics (input offset, bias current, slew rate, CMRR, GBP)' },
          { id: 'ac-oa-2', title: 'Inverting, non-inverting, summing, difference, and instrumentation amplifiers' },
          { id: 'ac-oa-3', title: 'Integrators, differentiators, log/antilog amplifiers, and precision rectifiers' },
          { id: 'ac-oa-4', title: 'Comparators, Schmitt triggers, astable/monostable multivibrators, and 555 timer' },
          { id: 'ac-oa-5', title: 'First-order and second-order active filters (LPF, HPF, BPF, Notch)' },
        ],
      },
    ],
  },
  {
    id: 'digital-circuits',
    code: 'DC',
    name: 'Digital Circuits',
    chapters: [
      {
        id: 'dc-boolean-logic',
        title: 'Number Systems & Boolean Algebra',
        topics: [
          { id: 'dc-bl-1', title: 'Number representations (binary, octal, hex, 1s/2s complement, IEEE-754 basics)' },
          { id: 'dc-bl-2', title: 'Boolean algebra laws, De Morgan theorems, SOP/POS canonical forms' },
          { id: 'dc-bl-3', title: 'Minimization using Karnaugh maps (up to 5 variables) and Quine-McCluskey concepts' },
          { id: 'dc-bl-4', title: 'Logic families (TTL, CMOS, ECL) — noise margin, fan-out, propagation delay, power dissipation' },
        ],
      },
      {
        id: 'dc-combinational',
        title: 'Combinational Logic Circuits',
        topics: [
          { id: 'dc-cb-1', title: 'Adders (half, full, carry-lookahead), subtractors, and magnitude comparators' },
          { id: 'dc-cb-2', title: 'Multiplexers, demultiplexers, decoders, encoders, and code converters' },
          { id: 'dc-cb-3', title: 'Static and dynamic hazards in combinational circuits' },
        ],
      },
      {
        id: 'dc-sequential',
        title: 'Sequential Logic Circuits',
        topics: [
          { id: 'dc-sq-1', title: 'Latches and flip-flops (SR, JK, D, T), excitation tables, setup/hold timing' },
          { id: 'dc-sq-2', title: 'Asynchronous (ripple) and synchronous counters, modulus counters' },
          { id: 'dc-sq-3', title: 'Shift registers (SISO, SIPO, PISO, PIPO), ring and Johnson counters' },
          { id: 'dc-sq-4', title: 'Finite State Machines (Mealy and Moore models), state minimization and sequence detectors' },
        ],
      },
      {
        id: 'dc-converters-memory',
        title: 'Data Converters, Memories & Microprocessors',
        topics: [
          { id: 'dc-cm-1', title: 'DAC architectures (weighted resistor, R-2R ladder) and resolution/accuracy' },
          { id: 'dc-cm-2', title: 'ADC architectures (Flash, SAR, Dual-Slope, Counter-type) and quantization error' },
          { id: 'dc-cm-3', title: 'Semiconductor memories (ROM, SRAM, DRAM, EPROM, Flash) and memory organization' },
          { id: 'dc-cm-4', title: 'Computer organization & 8085 microprocessor basics (architecture, addressing, interrupts, timing)' },
        ],
      },
    ],
  },
  {
    id: 'control-systems',
    code: 'CS',
    name: 'Control Systems',
    chapters: [
      {
        id: 'cs-modeling',
        title: 'Control System Modeling & Representation',
        topics: [
          { id: 'cs-m-1', title: 'Open-loop and closed-loop control, feedback sensitivity to parameter variations' },
          { id: 'cs-m-2', title: 'Transfer function models of mechanical, electrical, and electromechanical systems' },
          { id: 'cs-m-3', title: 'Block diagram reduction techniques' },
          { id: 'cs-m-4', title: 'Signal flow graphs and Mason gain formula' },
        ],
      },
      {
        id: 'cs-time-stability',
        title: 'Time-Domain Analysis & Stability',
        topics: [
          { id: 'cs-ts-1', title: 'Transient response of first- and second-order systems (rise time, peak overshoot, settling time)' },
          { id: 'cs-ts-2', title: 'Steady-state error, system type, and static error constants (Kp, Kv, Ka)' },
          { id: 'cs-ts-3', title: 'Routh-Hurwitz stability criterion and special cases' },
          { id: 'cs-ts-4', title: 'P, PI, PD, and PID controllers and effects on system response' },
        ],
      },
      {
        id: 'cs-frequency-rootlocus',
        title: 'Root Locus & Frequency Response',
        topics: [
          { id: 'cs-fr-1', title: 'Root locus construction rules, breakaway points, asymptotes, and stability analysis' },
          { id: 'cs-fr-2', title: 'Bode plots (magnitude and phase), gain margin and phase margin' },
          { id: 'cs-fr-3', title: 'Polar plots and Nyquist stability criterion (encirclements and stability)' },
          { id: 'cs-fr-4', title: 'Lead, lag, and lag-lead compensators (time and frequency domain design)' },
        ],
      },
      {
        id: 'cs-state-space',
        title: 'State-Space Analysis',
        topics: [
          { id: 'cs-ss-1', title: 'State-variable formulation, canonical forms, and transfer function from state model' },
          { id: 'cs-ss-2', title: 'State transition matrix (STM) and solution of state equations' },
          { id: 'cs-ss-3', title: 'Controllability (Kalman test) and observability of LTI systems' },
        ],
      },
    ],
  },
  {
    id: 'communications',
    code: 'CM',
    name: 'Communications',
    chapters: [
      {
        id: 'cm-random-info',
        title: 'Random Processes & Information Theory',
        topics: [
          { id: 'cm-ri-1', title: 'Random processes, stationarity (WSS, SSS), autocorrelation, and PSD' },
          { id: 'cm-ri-2', title: 'Noise in communication systems (AWGN, thermal noise, noise figure, noise temperature)' },
          { id: 'cm-ri-3', title: 'Information theory: entropy, mutual information, source coding (Huffman, Shannon-Fano)' },
          { id: 'cm-ri-4', title: 'Channel capacity, Shannon-Hartley theorem, and bandwidth-SNR trade-off' },
        ],
      },
      {
        id: 'cm-analog-modulation',
        title: 'Analog Communication Systems',
        topics: [
          { id: 'cm-am-1', title: 'Amplitude Modulation (AM, DSB-SC, SSB, VSB) — generation, detection, power efficiency' },
          { id: 'cm-am-2', title: 'Angle Modulation (FM and PM) — narrowband/wideband FM, Carson rule, generation/demodulation' },
          { id: 'cm-am-3', title: 'Superheterodyne receiver architecture and image frequency rejection' },
          { id: 'cm-am-4', title: 'SNR performance of AM, DSB-SC, SSB, and FM (pre-emphasis and de-emphasis)' },
        ],
      },
      {
        id: 'cm-digital-baseband',
        title: 'Digital Baseband & Pulse Modulation',
        topics: [
          { id: 'cm-db-1', title: 'PCM, DPCM, Delta Modulation (DM), Adaptive DM, and quantization SNR' },
          { id: 'cm-db-2', title: 'Line coding schemes (NRZ, RZ, Manchester, AMI) and bandwidth requirements' },
          { id: 'cm-db-3', title: 'Intersymbol Interference (ISI), Nyquist criterion for zero ISI, raised-cosine pulse' },
          { id: 'cm-db-4', title: 'Matched filter, correlation receiver, and MAP / ML detection' },
        ],
      },
      {
        id: 'cm-digital-bandpass',
        title: 'Bandpass Digital Modulation & Error Control Coding',
        topics: [
          { id: 'cm-dp-1', title: 'ASK, BPSK, QPSK, M-ary PSK, QAM, FSK, and MSK — constellations and bandwidth' },
          { id: 'cm-dp-2', title: 'Bit Error Rate (BER) and symbol error probability in AWGN channels' },
          { id: 'cm-dp-3', title: 'Time-Division Multiplexing (TDM), Frequency-Division Multiplexing (FDM), and TDMA/CDMA basics' },
          { id: 'cm-dp-4', title: 'Error control coding: linear block codes, Hamming distance, syndrome decoding, cyclic codes' },
        ],
      },
    ],
  },
  {
    id: 'electromagnetics',
    code: 'EMag',
    name: 'Electromagnetics',
    chapters: [
      {
        id: 'emag-maxwell',
        title: 'Electrostatics, Magnetostatics & Maxwell Equations',
        topics: [
          { id: 'emag-mx-1', title: 'Coordinate systems (Cartesian, Cylindrical, Spherical) and vector calculus identities' },
          { id: 'emag-mx-2', title: 'Gauss law, electric potential, boundary conditions for dielectrics and conductors' },
          { id: 'emag-mx-3', title: 'Biot-Savart law, Ampere circuital law, magnetic boundary conditions' },
          { id: 'emag-mx-4', title: 'Maxwell equations (differential and integral forms), displacement current, Poynting theorem' },
        ],
      },
      {
        id: 'emag-plane-waves',
        title: 'Uniform Plane Waves & Reflection',
        topics: [
          { id: 'emag-pw-1', title: 'Wave equations in free space, lossless and lossy dielectrics, and good conductors (skin depth)' },
          { id: 'emag-pw-2', title: 'Wave polarization (linear, circular, elliptical) and phase/group velocities' },
          { id: 'emag-pw-3', title: 'Normal and oblique incidence at dielectric/conductor interfaces, Brewster angle, total internal reflection' },
        ],
      },
      {
        id: 'emag-transmission-lines',
        title: 'Transmission Lines & Smith Chart',
        topics: [
          { id: 'emag-tl-1', title: 'Distributed parameter equations, characteristic impedance, propagation constant' },
          { id: 'emag-tl-2', title: 'Reflection coefficient, VSWR, input impedance, quarter-wave transformer' },
          { id: 'emag-tl-3', title: 'Smith Chart impedance matching (single and double stub tuning)' },
          { id: 'emag-tl-4', title: 'Transients on lossless transmission lines (bounce diagram)' },
        ],
      },
      {
        id: 'emag-waveguides-optics',
        title: 'Waveguides & Optical Fibers',
        topics: [
          { id: 'emag-wo-1', title: 'Parallel-plate and rectangular waveguides (TE and TM modes, cutoff frequency, dominant mode)' },
          { id: 'emag-wo-2', title: 'Circular waveguides and cylindrical/rectangular cavity resonators' },
          { id: 'emag-wo-3', title: 'Optical fibers: step-index and graded-index, numerical aperture, V-number, dispersion' },
        ],
      },
      {
        id: 'emag-antennas',
        title: 'Antennas & Radiation',
        topics: [
          { id: 'emag-an-1', title: 'Hertzian dipole, half-wave dipole, and monopole antennas' },
          { id: 'emag-an-2', title: 'Antenna parameters: radiation pattern, directivity, gain, radiation resistance, effective aperture' },
          { id: 'emag-an-3', title: 'Friis transmission formula and uniform linear antenna arrays (broadside, end-fire)' },
        ],
      },
    ],
  },
  {
    id: 'general-aptitude',
    code: 'GA',
    name: 'General Aptitude',
    chapters: [
      {
        id: 'ga-verbal',
        title: 'Verbal Aptitude',
        topics: [
          { id: 'ga-v-1', title: 'Basic English grammar: tenses, articles, adjectives, prepositions, conjunctions' },
          { id: 'ga-v-2', title: 'Vocabulary: words, idioms, and phrases in context' },
          { id: 'ga-v-3', title: 'Reading comprehension, narrative sequencing, and sentence completion' },
        ],
      },
      {
        id: 'ga-quantitative',
        title: 'Quantitative Aptitude',
        topics: [
          { id: 'ga-q-1', title: 'Data interpretation: bar graphs, pie charts, line graphs, and tables' },
          { id: 'ga-q-2', title: 'Numerical computation: ratios, percentages, powers, exponents, and logarithms' },
          { id: 'ga-q-3', title: 'Permutations and combinations, series, mensuration, and geometry' },
          { id: 'ga-q-4', title: 'Time, speed, distance, work, pipes, and elementary statistics/probability' },
        ],
      },
      {
        id: 'ga-analytical-spatial',
        title: 'Analytical & Spatial Aptitude',
        topics: [
          { id: 'ga-as-1', title: 'Logic: deduction, induction, analogy, numerical reasoning and puzzles' },
          { id: 'ga-as-2', title: 'Spatial aptitude: image transformation, rotation, reflection, paper folding, patterns' },
        ],
      },
    ],
  },
];

export const TOTAL_SYLLABUS_TOPICS = GATE_2027_ECE_SYLLABUS.reduce(
  (sum, subject) =>
    sum +
    subject.chapters.reduce((cSum, chapter) => cSum + chapter.topics.length, 0),
  0
);

export const ALL_SYLLABUS_TOPICS_MAP: Record<
  string,
  { subjectId: string; subjectName: string; chapterTitle: string; topicTitle: string }
> = GATE_2027_ECE_SYLLABUS.reduce(
  (acc, subject) => {
    for (const chapter of subject.chapters) {
      for (const topic of chapter.topics) {
        acc[topic.id] = {
          subjectId: subject.id,
          subjectName: subject.name,
          chapterTitle: chapter.title,
          topicTitle: topic.title,
        };
      }
    }
    return acc;
  },
  {} as Record<
    string,
    { subjectId: string; subjectName: string; chapterTitle: string; topicTitle: string }
  >
);
