export const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(`https://peaceful-castle-92022-d494fb7e686f.herokuapp.com/convert-to-base64?url=${encodeURIComponent(imageUrl)}`);
    const data = await response.json();

    return "data:image/jpeg;base64,"+data.base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);  
    throw error;
  }
}; 