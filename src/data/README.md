
# Training Data Management

The training courses are currently stored in `src/data/trainingData.ts`.

## How to Update Courses

1. Open `src/data/trainingData.ts`.
2. Edit the `courses` array.
3. You can add new courses, modify existing ones, or change the images/prices.

## Backend Integration

To make this dynamic with Supabase:
1. Create a `courses` table in Supabase.
2. Create a `SupabaseTrainingService.ts` similar to `SupabaseBrandsService.ts`.
3. Update `TrainingAdmin.tsx` to use the service instead of the local file.
4. Update `src/pages/Training.tsx` and `src/pages/CourseDetail.tsx` to fetch data from the service.

## Google Forms Integration

Updates to the Google Form URL should be done in `src/data/trainingData.ts` for each course.
Ensure the form has a file upload field for the payment screenshot.
