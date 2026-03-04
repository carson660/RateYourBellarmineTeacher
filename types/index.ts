export type Teacher = {
  teacher_id: number;
  name_en: string;
  slug: string;
  department: string;
  photo_url: string | null;
  photo_filename: string | null;
  courses: string[];
  created_at: string;
};

export type Review = {
  id: string;
  teacher_id: number;
  rating: number;
  difficulty: number;
  workload: number;
  tags: string[];
  comment: string;
  anon_hash: string;
  status: "visible" | "hidden";
  created_at: string;
};

export type TeacherWithStats = Teacher & {
  avg_rating: number | null;
  review_count: number;
  last_review_at: string | null;
};
