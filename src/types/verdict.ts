/**
 * LeetCode submission verdict contracts for GraphQL and REST network interception.
 */

export type SubmissionStatus =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Time Limit Exceeded'
  | 'Memory Limit Exceeded'
  | 'Runtime Error'
  | 'Compile Error'
  | 'Output Limit Exceeded'
  | 'Internal Error';

export interface VerdictPayload {
  submissionId?: string | number;
  status: SubmissionStatus;
  statusDisplay?: string;
  statusCode?: number;
  runtime?: string | number; // e.g. "56 ms" or 56
  memory?: string | number; // e.g. "42.1 MB" or 42100000
  runtimeDisplay?: string;
  memoryDisplay?: string;
  runtimePercentile?: number; // beats %
  memoryPercentile?: number;
  lang?: string;
  questionSlug?: string;
  questionId?: string;
  totalCorrect?: number;
  totalTestcases?: number;
  timestamp: number;
}

export interface GraphQLSubmissionCheckResponse {
  data?: {
    submissionDetails?: {
      runtime?: number;
      runtimeDisplay?: string;
      runtimePercentile?: number;
      memory?: number;
      memoryDisplay?: string;
      memoryPercentile?: number;
      code?: string;
      timestamp?: number;
      statusCode?: number;
      user?: {
        username?: string;
      };
      lang?: {
        name?: string;
        verboseName?: string;
      };
      question?: {
        questionId?: string;
        titleSlug?: string;
        hasFrontendId?: string;
      };
      notes?: string;
      flagType?: number;
    };
  };
}

export interface RestSubmissionCheckResponse {
  state?: 'PENDING' | 'STARTED' | 'SUCCESS';
  status_code?: number;
  status_msg?: string;
  status_runtime?: string;
  status_memory?: string;
  runtime_percentile?: number;
  memory_percentile?: number;
  question_id?: string;
  total_correct?: number;
  total_testcases?: number;
}
